import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { MovimentacaoEstoqueService } from './movimentacao-estoque.service';
import { CreateMovimentacaoEstoqueDto } from './dto/create-movimentacao-estoque.dto';
import { CurrentUser } from 'src/auth/current-user-decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import type { UserAuthPayload } from 'src/auth/jwt.strategy';


@UseGuards(JwtAuthGuard)
@Controller('estoque')
export class MovimentacaoEstoqueController {
  constructor(private readonly movimentacaoEstoqueService: MovimentacaoEstoqueService) {}

  @Post('/movimentacao')
  registrarMovimentacao (@Body() createMovimentacaoEstoqueDto: CreateMovimentacaoEstoqueDto,
    @CurrentUser() user: UserAuthPayload) {
    return this.movimentacaoEstoqueService.registrarMovimentacao(createMovimentacaoEstoqueDto, user.sub)
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

  @Get('/baixo')
  produtosEstoqueBaixo(){
    return this.movimentacaoEstoqueService.produtosEstoqueBaixo();  
  }

  @Get('/baixo/:id')
  produtoEstoque(@Param('id') id: string){
    return this.movimentacaoEstoqueService.produtoEstoque(id)
  }
}
