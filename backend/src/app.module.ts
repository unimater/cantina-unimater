import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { FormasPagamentoModule } from './formas-pagamento/formas-pagamento.module';
import { PrismaService } from './prisma/prisma-service';

@Module({
  imports: [FormasPagamentoModule, UsersModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
