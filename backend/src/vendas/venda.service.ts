import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Venda } from '../../generated/prisma'; 
import { ProdutoMaisVendido } from './dto/produto-mais-vendido.dto';
import { FechamentoCaixaFilters, FechamentoCaixaResponse } from './dto/relatorio-fechamento-caixa.dto';

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

  async gerarRelatorioFechamentoCaixa(filtros: FechamentoCaixaFilters): Promise<FechamentoCaixaResponse> {
    const where: any = {};

    if (filtros?.periodo?.dataInicial || filtros?.periodo?.dataFinal) {
      const createdAt: {
        gte?: Date;
        lte?: Date;
      } = {};

      if (filtros.periodo.dataInicial) {
        const start = new Date(`${filtros.periodo.dataInicial}T00:00:00.000`);
        createdAt.gte = start;
      }

      if (filtros.periodo.dataFinal) {
        const end = new Date(`${filtros.periodo.dataFinal}T23:59:59.999`);
        createdAt.lte = end;
      }

      where.createdAt = createdAt;
    }

    if (filtros?.formasPagamento && filtros.formasPagamento.length > 0) {
      where.formaPagamentoId = { in: filtros.formasPagamento };
    }

    if (filtros?.produtos && filtros.produtos.length > 0) {
      where.produtos = { some: { produtoId: { in: filtros.produtos } } };
    }

    if (filtros?.categorias && filtros.categorias.length > 0) {
      where.produtos = Object.assign(where.produtos || {}, {
        some: { produto: { categoriaId: { in: filtros.categorias } } },
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

    const formaPagamentoCounts: Record<string, { nome: string; quantidade: number }> = {};
    const produtoCounts: Record<string, { nome: string; quantidade: number }> = {};

    for (const venda of vendas) {
      if (venda.formaPagamento) {
        const fpId = venda.formaPagamento.id;
        formaPagamentoCounts[fpId] = formaPagamentoCounts[fpId] || { nome: venda.formaPagamento.name || '—', count: 0 };
        formaPagamentoCounts[fpId].quantidade += 1;
      }

      if (venda.produtos) {
        for (const produto of venda.produtos) {
          const pId = produto.id;
          produtoCounts[pId] = produtoCounts[pId] || { nome: produto.produto?.descricao || '—', quantidade: 0 };
          produtoCounts[pId].quantidade += produto.quantidade || 0;
        }
      }
    }

    const formaPagamentoMaisUsada = Object.entries(formaPagamentoCounts).sort((a, b) => b[1].quantidade - a[1].quantidade)[0];
    const produtoMaisVendido = Object.entries(produtoCounts).sort((a, b) => b[1].quantidade - a[1].quantidade)[0];

    return {
      vendas: vendas,
      sumario: {
        totalLiquido: vendas.reduce((sum, venda) => sum + (Number(venda.valorLiquido) || 0), 0),
        totalBruto: vendas.reduce((sum, venda) => sum + (Number(venda.valorTotalVenda) || 0), 0),
        descontos: vendas.reduce((sum, venda) => sum + (Number(venda.valorTotalDesconto) || 0), 0),
        produtoMaisVendido: produtoMaisVendido ? { id: produtoMaisVendido[0], nome: produtoMaisVendido[1].nome, quantidade: produtoMaisVendido[1].quantidade } : null,
        formaPagamentoMaisUsada: formaPagamentoMaisUsada ? { id: formaPagamentoMaisUsada[0], nome: formaPagamentoMaisUsada[1].nome, quantidade: formaPagamentoMaisUsada[1].quantidade } : null,
      },
    };
  }
}
