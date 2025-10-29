import { Module } from '@nestjs/common';
import { MovimentacaoEstoqueService } from './movimentacao-estoque.service';
import { MovimentacaoEstoqueController } from './movimentacao-estoque.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [MovimentacaoEstoqueController],
  providers: [MovimentacaoEstoqueService, PrismaService],
})
export class MovimentacaoEstoqueModule {}
