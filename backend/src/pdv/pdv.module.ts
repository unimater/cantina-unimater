import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PdvController } from './pdv.controller';
import { PdvService } from './pdv.service';
import { MovimentacaoEstoqueModule } from 'src/movimentacao-estoque/movimentacao-estoque.module';

@Module({
  controllers: [PdvController],
  providers: [PdvService, PrismaService],
  imports: [MovimentacaoEstoqueModule]
})
export class PdvModule {}


