import { Controller, Get, Query, ParseIntPipe } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { ResumoFinanceiroDto } from './dto/resumo-financeiro.dto';
import { ProdutoMaisVendidoDto } from './dto/produto-mais-vendido.dto';
import { VendaFormaPagamentoDto } from './dto/venda-forma-pagamento.dto';
import { ItemEstoqueDto } from './dto/item-estoque.dto';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('resumo')
  async getResumoFinanceiro(
    @Query('periodo') periodo: 'hoje' | 'semana' | 'mes' = 'hoje',
  ): Promise<ResumoFinanceiroDto> {
    return this.dashboardService.getResumoFinanceiro(periodo);
  }

  @Get('produtos-mais-vendidos')
  async getProdutosMaisVendidos(
    @Query('limite', new ParseIntPipe({ optional: true })) limite: number = 10,
  ): Promise<ProdutoMaisVendidoDto[]> {
    return this.dashboardService.getProdutosMaisVendidos(limite);
  }

  @Get('vendas-por-forma-pagamento')
  async getVendasPorFormaPagamento(): Promise<VendaFormaPagamentoDto[]> {
    return this.dashboardService.getVendasPorFormaPagamento();
  }

  @Get('controle-estoque')
  async getControleEstoque(): Promise<ItemEstoqueDto[]> {
    return this.dashboardService.getControleEstoque();
  }
}
