import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { VendaService } from 'src/vendas/venda.service';
import { MovimentacaoEstoqueService } from 'src/movimentacao-estoque/movimentacao-estoque.service';

import { ResumoFinanceiroDto } from './dto/resumo-financeiro.dto';
import { ProdutoMaisVendidoDto } from './dto/produto-mais-vendido.dto';
import { VendaFormaPagamentoDto } from './dto/venda-forma-pagamento.dto';
import { ItemEstoqueDto } from './dto/item-estoque.dto';

@Injectable()
export class DashboardService {
  constructor(
    private prisma: PrismaService,
    private vendaService: VendaService,
    private movimentacaoEstoqueService: MovimentacaoEstoqueService,
  ) {}

  async getResumoFinanceiro(
    periodo: 'hoje' | 'semana' | 'mes' = 'hoje',
  ): Promise<ResumoFinanceiroDto> {
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
      where: { data: { gte: dataInicio } },
    });

    const totalDespesas = despesas.reduce(
      (acc, despesa) => acc + Number(despesa.valor),
      0,
    );

    const vendas = await this.prisma.venda.findMany({
      where: { data: { gte: dataInicio } },
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

  async getProdutosMaisVendidos(
    limite: number = 10,
  ): Promise<ProdutoMaisVendidoDto[]> {
    const produtosMaisVendidos = await this.vendaService.findProdutosMaisVendidos();

    return produtosMaisVendidos.slice(0, limite).map((item) => ({
      produto: item.produto?.descricao || 'Produto não encontrado',
      quantidade: item.quantidadeVendida,
    }));
  }

  async getVendasPorFormaPagamento(): Promise<VendaFormaPagamentoDto[]> {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const vendas = await this.prisma.venda.findMany({
      where: { data: { gte: hoje } },
      include: { formaPagamento: true },
    });

    const totalGeral = vendas.reduce(
      (acc, venda) => acc + Number(venda.valorTotal),
      0,
    );

    const vendasPorForma = vendas.reduce((acc, venda) => {
      const nome = venda.formaPagamento.name;
      const valor = Number(venda.valorTotal);

      acc[nome] = (acc[nome] || 0) + valor;

      return acc;
    }, {} as Record<string, number>);

    return Object.entries(vendasPorForma).map(
      ([formaPagamento, valor]) => ({
        formaPagamento,
        valor,
        percentual: totalGeral
          ? Math.round((valor / totalGeral) * 100)
          : 0,
      }),
    );
  }

  async getControleEstoque(): Promise<ItemEstoqueDto[]> {
    return this.movimentacaoEstoqueService.listarEstoqueComStatus();
  }
}
