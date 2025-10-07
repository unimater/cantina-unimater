import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FormasPagamentoModule } from './formas-pagamento/formas-pagamento.module';
import { PrismaService } from './prisma/prisma-service';

@Module({
  imports: [FormasPagamentoModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
