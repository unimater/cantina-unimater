import { Injectable, BadRequestException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreatePedidoDto } from './dto/create-pedido.dto'
import { CancelPedidoDto } from './dto/cancel-pedido.dto'
import { Prisma } from '../../generated/prisma'
import { isSameDay } from 'date-fns'

@Injectable()
export class PedidoService {
  constructor(private prisma: PrismaService) {}

  // ✅ Criação simples de pedido (sem itens)
  async create(dto: CreatePedidoDto) {
    try {
      const pedido = await this.prisma.pedido.create({
        data: {
          descricao: dto.descricao,
          total: dto.total,
          status: 'FINALIZADO',
          // opcional, se o campo existir no banco:
          categoria: dto.categoria ?? 'PRODUTO',
          createdAt: new Date(),
          situacao: dto.situacao ?? true,
        },
      })

      return pedido
    } catch (error) {
      console.error('Erro ao criar pedido:', error)
      throw new BadRequestException('Erro ao criar pedido')
    }
  }

  // ✅ Listagem (mantida)
  async findAll(params: {
    status?: string
    dataInicio?: Date
    dataFim?: Date
    skip?: number
    take?: number
  }) {
    const where: Prisma.PedidoWhereInput = {}

    if (params.status) where.status = params.status as any
    if (params.dataInicio && params.dataFim)
      where.dataPedido = { gte: params.dataInicio, lte: params.dataFim }

    return this.prisma.pedido.findMany({
      where,
      skip: params.skip,
      take: params.take,
      orderBy: { createdAt: 'desc' },
    })
  }

  // ✅ Buscar pedido por ID
  async findOne(id: string) {
    const pedido = await this.prisma.pedido.findUnique({
      where: { id },
    })

    if (!pedido) throw new BadRequestException('Pedido não encontrado')
    return pedido
  }

  // ✅ Cancelamento simples
  async cancel(id: string, dto: CancelPedidoDto) {
    const pedido = await this.prisma.pedido.findUnique({ where: { id } })

    if (!pedido) throw new BadRequestException('Pedido não encontrado')
    if (!isSameDay(pedido.dataPedido, new Date()))
      throw new BadRequestException('Somente pedidos do dia podem ser cancelados')
    if (pedido.status === 'CANCELADO')
      throw new BadRequestException('Pedido já cancelado')

    return this.prisma.pedido.update({
      where: { id },
      data: {
        status: 'CANCELADO',
        motivoCancelamento: dto.motivo,
        dataCancelamento: new Date(),
      },
    })
  }
}
