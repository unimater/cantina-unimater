import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoriasModule } from './categorias/categorias.module';
import { ProdutosModule } from './produtos/produtos.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [CategoriasModule, ProdutosModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
