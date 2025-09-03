import { Module } from '@nestjs/common';
import { FormasPagamentoService } from './formas-pagamento.service';
import { FormasPagamentoController } from './formas-pagamento.controller';
import { PrismaService } from 'src/prisma/prisma-service';

@Module({
  controllers: [FormasPagamentoController],
  providers: [FormasPagamentoService, PrismaService],
})
export class FormasPagamentoModule {}
