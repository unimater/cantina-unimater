import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { VendaModule } from 'src/vendas/venda.module';
import { MovimentacaoEstoqueModule } from 'src/movimentacao-estoque/movimentacao-estoque.module';

@Module({
  imports: [VendaModule, MovimentacaoEstoqueModule],
  controllers: [DashboardController],
  providers: [DashboardService, PrismaService],
  exports: [DashboardService],
})
export class DashboardModule {}
