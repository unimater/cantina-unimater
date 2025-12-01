import { Module } from '@nestjs/common'
import { PedidoService } from './pedido.service'
import { PedidoController } from './pedido.controller'
import { PrismaService } from '../prisma/prisma.service'

@Module({
  controllers: [PedidoController],
  providers: [PedidoService, PrismaService]
})
export class PedidoModule {}
