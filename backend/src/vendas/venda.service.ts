import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import type { Produto, Venda } from '../../generated/prisma'; 
import { ProdutoMaisVendido } from './dto/produto-mais-vendido.dto';
import { RelatorioFilters } from './dto/relatorio.dto';
import { Buffer } from 'buffer';

@Injectable()
export class VendaService {
  constructor(private prismaService: PrismaService) {}

  async findAllVendas(): Promise<Venda[]> {
    return this.prismaService.venda.findMany({
      include: {
        produtos: true,
        formaPagamento: true,
      },
    });
  }

  async gerarRelatorio(filters: RelatorioFilters): Promise<any> {
    const where: any = {};

    if (filters?.periodo?.startDate || filters?.periodo?.endDate) {
  const createdAt: any = {};

  if (filters.periodo.startDate) {
    const start = new Date(`${filters.periodo.startDate}T00:00:00.000`);
    createdAt.gte = start;
  }

  if (filters.periodo.endDate) {
    const end = new Date(`${filters.periodo.endDate}T23:59:59.999`);
    createdAt.lte = end;
  }

  where.createdAt = createdAt;
}

    if (filters?.formasPagamento && filters.formasPagamento.length > 0) {
      where.formaPagamentoId = { in: filters.formasPagamento };
    }

    if (filters?.produtos && filters.produtos.length > 0) {
      where.produtos = { some: { produtoId: { in: filters.produtos } } };
    }

    if (filters?.categorias && filters.categorias.length > 0) {
      where.produtos = Object.assign(where.produtos || {}, {
        some: { produto: { categoriaId: { in: filters.categorias } } },
      });
    }

    const vendas = await this.prismaService.venda.findMany({
      where,
      include: {
        produtos: { include: { produto: true } },
        formaPagamento: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const vendasNormalized = vendas.map((v) => {
      const val = (v as any).valorTotalVenda ?? (v as any).valorLiquido ?? 0;
      const num = typeof val === 'object' && typeof val.toNumber === 'function' ? val.toNumber() : Number(val);
      return {
        ...v,
        total: isNaN(num) ? 0 : num,
      } as any;
    });

    const total = vendasNormalized.reduce((sum, v) => sum + (v.total || 0), 0);

    const produtoCounts: Record<string, { nome: string; quantidade: number }> = {};
    const pagamentoCounts: Record<string, { nome: string; count: number }> = {};

    for (const v of vendas) {
      if (v.formaPagamento) {
        const id = String(v.formaPagamento.id);
        const nomeForma = (v.formaPagamento as any).name || (v.formaPagamento as any).nome || '—';
        pagamentoCounts[id] = pagamentoCounts[id] || { nome: nomeForma, count: 0 };
        pagamentoCounts[id].count += 1;
      }

      if (v.produtos) {
        for (const p of v.produtos) {
          const pid = String(p.produtoId);
          const produtoNome = (p.produto as any)?.descricao || (p.produto as any)?.nome || '—';
          produtoCounts[pid] = produtoCounts[pid] || { nome: produtoNome, quantidade: 0 };
          produtoCounts[pid].quantidade += p.quantidade || 0;
        }
      }
    }

    const mostSold = Object.entries(produtoCounts).sort((a, b) => b[1].quantidade - a[1].quantidade)[0];
    const mostUsedPayment = Object.entries(pagamentoCounts).sort((a, b) => b[1].count - a[1].count)[0];

    return {
      vendas: vendasNormalized,
      summary: {
        total,
        mostSold: mostSold ? { id: mostSold[0], nome: mostSold[1].nome, quantidade: mostSold[1].quantidade } : null,
        mostUsedPayment: mostUsedPayment ? { id: mostUsedPayment[0], nome: mostUsedPayment[1].nome, count: mostUsedPayment[1].count } : null,
      },
    };
  }

  async findProdutosMaisVendidos(): Promise<ProdutoMaisVendido[]> {
    const produtos = await this.prismaService.vendaProduto.groupBy({
      by: ['produtoId'],
      _sum: {
        quantidade: true,
      },
      orderBy: {
        _sum: {
          quantidade: 'desc',
        },
      },
    });

    const top5 = produtos.slice(0, 5);

    const result = await Promise.all(
      top5.map(async (p) => {
        const produtoInfo = await this.prismaService.produto.findUnique({
          where: { id: p.produtoId },
        });

        return {
          produtoId: p.produtoId,
          produto: produtoInfo,
          quantidadeVendida: p._sum.quantidade || 0,
        };
      })
    );

    return result;
  }
  
}
