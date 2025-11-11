import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Delete,
  BadRequestException,
  Query,
} from '@nestjs/common'
import { PedidoService } from './pedido.service'
import { CreatePedidoDto } from './dto/create-pedido.dto'
import { UpdatePedidoDto } from './dto/update-pedido.dto'

@Controller('pedido')
export class PedidoController {
  constructor(private readonly pedidoService: PedidoService) {}

  // ✅ Buscar todos com filtros opcionais
  @Get()
  findAll(
    @Query('status') status?: string,
    @Query('formaPagamentoId') formaPagamentoId?: string,
    @Query('dataInicio') dataInicio?: string,
    @Query('dataFim') dataFim?: string,
    @Query('skip') skip?: number,
    @Query('take') take?: number,
  ) {
    // 🔹 Monta o objeto de filtros
    const params = {
      status,
      formaPagamentoId,
      dataInicio,
      dataFim,
      skip,
      take,
    }

    return this.pedidoService.findAll(params)
  }

  // ✅ Buscar um pedido específico
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pedidoService.findOne(id)
  }

  // ✅ Criar pedido
  @Post()
  create(@Body() dto: CreatePedidoDto) {
    return this.pedidoService.create(dto)
  }

  // ✅ Atualizar pedido
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePedidoDto) {
    return this.pedidoService.update(id, dto)
  }

  // ✅ Remover pedido
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const deleted = await this.pedidoService.remove(id)
    if (!deleted) throw new BadRequestException('Erro ao excluir o pedido.')
    return { message: 'Pedido excluído com sucesso.' }
  }
}
