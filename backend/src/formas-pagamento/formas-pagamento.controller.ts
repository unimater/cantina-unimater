import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, HttpCode, UseGuards } from '@nestjs/common';
import { FormasPagamentoService } from './formas-pagamento.service';
import { CreateFormasPagamentoDto } from './dto/create-formas-pagamento.dto';
import { UpdateFormasPagamentoDto } from './dto/update-formas-pagamento.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CurrentUser } from 'src/auth/current-user-decorator';
import type { UserAuthPayload } from 'src/auth/jwt.strategy';

@Controller('formas-pagamento')
@UseGuards(JwtAuthGuard)
export class FormasPagamentoController {
  constructor(private readonly formasPagamentoService: FormasPagamentoService) {}

  @Post()
  @HttpCode(201)
  create(@Body() createFormasPagamentoDto: CreateFormasPagamentoDto, @CurrentUser() user: UserAuthPayload) {
    console.log('user', user.sub);
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
  update(@Param('id') id: string, @Body() updateFormasPagamentoDto: UpdateFormasPagamentoDto, @CurrentUser() user: UserAuthPayload) {
    console.log('user', user.sub);
    return this.formasPagamentoService.update(id, updateFormasPagamentoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: UserAuthPayload) {
    console.log('user', user.sub);
    return this.formasPagamentoService.remove(id);
  }
}
