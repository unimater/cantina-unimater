import { Controller, Get, Post, Param, Body, Query, Patch } from '@nestjs/common'
import { PedidoService } from './pedido.service'
import { CreatePedidoDto } from './dto/create-pedido.dto'
import { CancelPedidoDto } from './dto/cancel-pedido.dto'

@Controller('pedido')
export class PedidoController {
  constructor(private service: PedidoService) {}

  @Post()
  create(@Body() dto: CreatePedidoDto) {
    return this.service.create(dto)
  }

  @Get()
  findAll(@Query() query: any) {
    return this.service.findAll(query)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id)
  }

  @Patch(':id/cancelar')
  cancel(@Param('id') id: string, @Body() dto: CancelPedidoDto) {
    return this.service.cancel(id, dto)
  }
}
