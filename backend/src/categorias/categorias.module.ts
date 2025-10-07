import { Module } from '@nestjs/common';
import { CategoriasService } from './categorias.service';
import { CategoriasController } from './categorias.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [CategoriasController],
  providers: [CategoriasService, PrismaService],
})
export class CategoriasModule {}
