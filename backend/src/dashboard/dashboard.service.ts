import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResumoFinanceiroDto } from './dto/resumo-financeiro.dto';
import { ProdutoMaisVendidoDto } from './dto/produto-mais-vendido.dto';
import { VendaFormaPagamentoDto } from './dto/venda-forma-pagamento.dto';
import { ItemEstoqueDto } from './dto/item-estoque.dto';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getResumoFinanceiro(periodo: 'hoje' | 'semana' | 'mes' = 'hoje'): Promise<ResumoFinanceiroDto> {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    let dataInicio: Date;
    switch (periodo) {
      case 'semana':
        dataInicio = new Date(hoje);
        dataInicio.setDate(hoje.getDate() - 7);
        break;
      case 'mes':
        dataInicio = new Date(hoje);
        dataInicio.setMonth(hoje.getMonth() - 1);
        break;
      default:
        dataInicio = hoje;
    }

    const despesas = await this.prisma.despesa.findMany({
      where: {
        data: {
          gte: dataInicio,
        },
      },
    });

    const totalDespesas = despesas.reduce(
      (acc, despesa) => acc + Number(despesa.valor),
      0,
    );

    const vendas = await this.prisma.venda.findMany({
      where: {
        data: {
          gte: dataInicio,
        },
      },
    });

    const totalReceitas = vendas.reduce(
      (acc, venda) => acc + Number(venda.valorTotal),
      0,
    );

    const saldo = totalReceitas - totalDespesas;

    return {
      totalReceitas,
      totalDespesas,
      saldo,
      periodo,
    };
  }

  async getProdutosMaisVendidos(limite: number = 10): Promise<ProdutoMaisVendidoDto[]> {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const produtosVendidos = await this.prisma.itemVenda.groupBy({
      by: ['produtoId'],
      where: {
        venda: {
          data: {
            gte: hoje,
          },
        },
      },
      _sum: {
        quantidade: true,
      },
      orderBy: {
        _sum: {
          quantidade: 'desc',
        },
      },
      take: limite,
    });

    const produtosComNome = await Promise.all(
      produtosVendidos.map(async (item) => {
        const produto = await this.prisma.produto.findUnique({
          where: { id: item.produtoId },
        });
        return {
          produto: produto?.descricao || 'Produto não encontrado',
          quantidade: item._sum.quantidade || 0,
        };
      }),
    );

    return produtosComNome;
  }

  async getVendasPorFormaPagamento(): Promise<VendaFormaPagamentoDto[]> {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const vendas = await this.prisma.venda.findMany({
      where: {
        data: {
          gte: hoje,
        },
      },
      include: {
        formaPagamento: true,
      },
    });

    const totalGeral = vendas.reduce(
      (acc, venda) => acc + Number(venda.valorTotal),
      0,
    );

    const vendasPorForma = vendas.reduce((acc, venda) => {
      const nome = venda.formaPagamento.name;
      const valor = Number(venda.valorTotal);
      
      if (!acc[nome]) {
        acc[nome] = 0;
      }
      acc[nome] += valor;
      
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(vendasPorForma).map(([formaPagamento, valor]) => ({
      formaPagamento,
      valor,
      percentual: totalGeral > 0 ? Math.round((valor / totalGeral) * 100) : 0,
    }));
  }

  async getControleEstoque(): Promise<ItemEstoqueDto[]> {
    const estoques = await this.prisma.estoque.findMany({
      include: {
        produto: {
          include: {
            categoria: true,
          },
        },
      },
      where: {
        produto: {
          situacao: true,
        },
      },
    });

    return estoques.map((estoque) => {
      let status: 'Esgotado' | 'Baixo estoque' | 'Disponível';

      if (estoque.quantidade === 0) {
        status = 'Esgotado';
      } else if (estoque.quantidade <= estoque.quantidadeMin) {
        status = 'Baixo estoque';
      } else {
        status = 'Disponível';
      }

      return {
        id: estoque.produto.id,
        produto: estoque.produto.descricao,
        quantidade: estoque.quantidade,
        quantidadeMin: estoque.quantidadeMin,
        status,
      };
    });
  }
}
