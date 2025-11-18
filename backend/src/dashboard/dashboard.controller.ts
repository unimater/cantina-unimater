import { Controller, Get, Query, ParseIntPipe } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('resumo')
  async getResumoFinanceiro(
    @Query('periodo') periodo: 'hoje' | 'semana' | 'mes' = 'hoje',
  ) {
    return this.dashboardService.getResumoFinanceiro(periodo);
  }

  @Get('produtos-mais-vendidos')
  async getProdutosMaisVendidos(
    @Query('limite', new ParseIntPipe({ optional: true })) limite: number = 10,
  ) {
    return this.dashboardService.getProdutosMaisVendidos(limite);
  }

  @Get('vendas-por-forma-pagamento')
  async getVendasPorFormaPagamento() {
    return this.dashboardService.getVendasPorFormaPagamento();
  }

  @Get('controle-estoque')
  async getControleEstoque() {
    return this.dashboardService.getControleEstoque();
  }
}
