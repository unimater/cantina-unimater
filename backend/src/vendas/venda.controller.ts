import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, HttpCode } from '@nestjs/common';
import {  VendaService } from './venda.service';
import { Venda } from 'generated/prisma';
import { ProdutoMaisVendido } from './dto/produto-mais-vendido.dto';
import { FechamentoCaixaFilters, FechamentoCaixaResponse } from './dto/relatorio-fechamento-caixa.dto';

@Controller('venda')
export class VendaController {
  constructor(private readonly vendaService: VendaService) {}

  @Get()
  @HttpCode(200)
  getVendas(): Promise<Venda[]> {
    return this.vendaService.findAllVendas();
  }

  @Get('/produtos-mais-vendidos')
  @HttpCode(200)
  findProdutosMaisVendidos(): Promise<ProdutoMaisVendido[]> {
    return this.vendaService.findProdutosMaisVendidos()
  }

  @Post('/fechamento-caixa')
  @HttpCode(200)
  gerarRelatorioFechamentoCaixa(@Body() filters: FechamentoCaixaFilters): Promise<FechamentoCaixaResponse> {
    return this.vendaService.gerarRelatorioFechamentoCaixa(filters);
  }
}
