import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, HttpCode, UseGuards } from '@nestjs/common';
import { PdvService } from './pdv.service';
import { ConcluirVendaPdvDTO } from './dto/concluir-venda-pdv.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import type { UserAuthPayload } from 'src/auth/jwt.strategy';
import { CurrentUser } from 'src/auth/current-user-decorator';

@Controller('pdv')
@UseGuards(JwtAuthGuard)
export class PdvController {
  constructor(private readonly pdvService: PdvService) {}

  @Post()
  @HttpCode(201)
  concluirVendaPdv(@Body() concluirVendaPdvDto: ConcluirVendaPdvDTO, @CurrentUser() user: UserAuthPayload) {
    return this.pdvService.concluirVendaPdv(concluirVendaPdvDto, user.sub);
  }

}
