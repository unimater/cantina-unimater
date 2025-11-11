import { Controller, Get, Post, Patch, Body, Param, Delete, BadRequestException } from '@nestjs/common';
import { PedidoService } from './pedido.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';

@Controller('pedido')
export class PedidoController {
  constructor(private readonly pedidoService: PedidoService) {}

  @Get()
  findAll() {
    return this.pedidoService.findAll({});
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pedidoService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreatePedidoDto) {
    return this.pedidoService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePedidoDto) {
    return this.pedidoService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const deleted = await this.pedidoService.remove(id);
    if (!deleted) throw new BadRequestException('Erro ao excluir o pedido.');
    return { message: 'Pedido excluído com sucesso.' };
  }
}
