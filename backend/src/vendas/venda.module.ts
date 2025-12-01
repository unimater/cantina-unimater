import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { VendaController } from './venda.controller';
import { VendaService } from './venda.service';

@Module({
  controllers: [VendaController],
  providers: [VendaService, PrismaService],
  exports: [VendaService],
})
export class VendaModule {}


