import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { CategoriasModule } from './categorias/categorias.module'
import { DespesasModule } from './despesas/despesas.module'
import { envSchema } from './env'
import { FormasPagamentoModule } from './formas-pagamento/formas-pagamento.module'
import { PrismaService } from './prisma/prisma.service'
import { ProdutosModule } from './produtos/produtos.module'
import { UsersModule } from './users/users.module'
import { AuthController } from './auth/auth.controller'
import { EmailModule } from './emails/email.module'
import { PedidoModule } from './pedido/pedido.module'

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      validate: env => envSchema.parse(env),
      isGlobal: true
    }),
    FormasPagamentoModule,
    UsersModule,
    DespesasModule,
    CategoriasModule,
    ProdutosModule,
    EmailModule,
    PedidoModule
  ],
  controllers: [AppController, AuthController],
  providers: [AppService, PrismaService]
})
export class AppModule {}
