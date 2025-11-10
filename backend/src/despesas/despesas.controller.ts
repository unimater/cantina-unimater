import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { DespesasService } from './despesas.service';
import { CreateDespesaDto } from './dto/create-despesa.dto';
import { UpdateDespesaDto } from './dto/update-despesa.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CurrentUser } from 'src/auth/current-user-decorator';
import type { UserAuthPayload } from 'src/auth/jwt.strategy';

@Controller('despesas')
@UseGuards(JwtAuthGuard)
export class DespesasController {
  constructor(private readonly despesasService: DespesasService) {}

  // Criar despesa
  @Post()
  create(@Body() createDespesaDto: CreateDespesaDto, @CurrentUser() user: UserAuthPayload) {
    return this.despesasService.create(createDespesaDto, user.sub);
  }

  // Listar todas as despesas
  @Get()
  findAll() {
    return this.despesasService.findAll();
  }

  // Buscar despesa por ID
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.despesasService.findOne(id);
  }

  // Atualizar despesa
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDespesaDto: UpdateDespesaDto) {
    return this.despesasService.update(id, updateDespesaDto);
  }

  // Remover despesa
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.despesasService.remove(id);
  }
}