import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, HttpCode } from '@nestjs/common';
import {  VendaService } from './venda.service';
import { Produto, Venda } from 'generated/prisma';
import { ProdutoMaisVendido } from './dto/produto-mais-vendido.dto';
import { RelatorioFilters } from './dto/relatorio.dto';

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

  @Post('/relatorio')
  @HttpCode(200)
  gerarRelatorio(@Body() filters: RelatorioFilters): Promise<any> {
    return this.vendaService.gerarRelatorio(filters);
  }
}
