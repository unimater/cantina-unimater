import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { MovimentacaoEstoqueService } from './movimentacao-estoque.service';
import { CreateMovimentacaoEstoqueDto } from './dto/create-movimentacao-estoque.dto';
import { UpdateMovimentacaoEstoqueDto } from './dto/update-movimentacao-estoque.dto';

@Controller('estoque')
export class MovimentacaoEstoqueController {
  constructor(private readonly movimentacaoEstoqueService: MovimentacaoEstoqueService) {}

  @Post('/movimentacao')
  registrarMovimentacao (@Body() createMovimentacaoEstoqueDto: CreateMovimentacaoEstoqueDto) {
    return this.movimentacaoEstoqueService.registrarMovimentacao(createMovimentacaoEstoqueDto)
  }

  @Get('/movimentacoes') 
  listarMovimentacoes(
    @Query('tipo') tipo?: 'ENTRADA' | 'SAIDA',
    @Query('produtoId') produtoId?: string,
    @Query('usuarioId') usuarioId?: string,
    @Query('dataInicio') dataInicio?: string,
    @Query('dataFim') dataFim?: string
  ) {
    return this.movimentacaoEstoqueService.listarMovimentacoes({
      tipo,
      produtoId,
      usuarioId,
      dataInicio,
      dataFim
    })
  }
  
  @Get()
  listarEstoque () {
    return this.movimentacaoEstoqueService.listarEstoque()
  }

  @Post()
  baixarEstoque(
    @Body() bodyBaixaPdv: {produtoId: string, quantidade: number, usuarioId: string}
  ) {
    return this.movimentacaoEstoqueService.baixarEstoque(bodyBaixaPdv)
  }
}
