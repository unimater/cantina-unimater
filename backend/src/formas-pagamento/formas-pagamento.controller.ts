import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, HttpCode } from '@nestjs/common';
import { FormasPagamentoService } from './formas-pagamento.service';
import { CreateFormasPagamentoDto } from './dto/create-formas-pagamento.dto';
import { UpdateFormasPagamentoDto } from './dto/update-formas-pagamento.dto';

@Controller('formas-pagamento')
export class FormasPagamentoController {
  constructor(private readonly formasPagamentoService: FormasPagamentoService) {}

  @Post()
  @HttpCode(201)
  create(@Body() createFormasPagamentoDto: CreateFormasPagamentoDto) {
    return this.formasPagamentoService.create(createFormasPagamentoDto);
  }

  @Get()
  findAll() {
    return this.formasPagamentoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.formasPagamentoService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFormasPagamentoDto: UpdateFormasPagamentoDto) {
    return this.formasPagamentoService.update(id, updateFormasPagamentoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.formasPagamentoService.remove(id);
  }
}
