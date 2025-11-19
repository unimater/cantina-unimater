import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, HttpCode } from '@nestjs/common';
import { PdvService } from './pdv.service';
import { ConcluirVendaPdvDTO } from './dto/concluir-venda-pdv.dto';

@Controller('pdv')
export class PdvController {
  constructor(private readonly pdvService: PdvService) {}

  @Post()
  @HttpCode(201)
  concluirVendaPdv(@Body() concluirVendaPdvDto: ConcluirVendaPdvDTO) {
    return this.pdvService.concluirVendaPdv(concluirVendaPdvDto);
  }

}
