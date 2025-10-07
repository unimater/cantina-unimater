import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoriasModule } from './categorias/categorias.module';
import { ProdutosModule } from './produtos/produtos.module';
import { PrismaService } from './prisma/prisma.service';
import { DespesasModule } from './despesas/despesas.module';
import { UsersModule } from './users/users.module';
import { FormasPagamentoModule } from './formas-pagamento/formas-pagamento.module';

@Module({
  imports: [
    FormasPagamentoModule,
    UsersModule,
    DespesasModule,
    CategoriasModule,
    ProdutosModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
