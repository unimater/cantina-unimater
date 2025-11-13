import { Injectable, BadRequestException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreatePedidoDto } from './dto/create-pedido.dto'
import { UpdatePedidoDto } from './dto/update-pedido.dto'
import { Decimal } from '@prisma/client/runtime/library'

@Injectable()
export class PedidoService {
  constructor(private prisma: PrismaService) {}

  // Criar pedido + itens
  async create(dto: CreatePedidoDto) {
    try {
      const totalCalculado =
        dto.itens?.reduce((acc, item) => acc + item.subtotal, 0) ?? 0

      const pedido = await this.prisma.$transaction(async (tx) => {
        const novoPedido = await tx.pedido.create({
          data: {
            descricao: dto.descricao,
            total: new Decimal(totalCalculado || dto.total || 0),
            status: 'FINALIZADO',
            categoria: dto.categoria ?? 'PRODUTO',
            situacao: dto.situacao ?? true,
            createdAt: new Date(),
            itens: {
              create: dto.itens.map((item) => ({
                produtoId: item.produtoId,
                quantidade: item.quantidade,
                precoUnitario: new Decimal(item.precoUnitario),
                subtotal: new Decimal(item.subtotal),
              })),
            },
          },
          include: { itens: true },
        })

        return novoPedido
      })

      return pedido
    } catch (error) {
      console.error('❌ Erro ao criar pedido:', error)
      throw new BadRequestException('Erro ao criar pedido.')
    }
  }

  // Atualizar pedido + itens
  async update(id: string, dto: UpdatePedidoDto) {
    const pedidoExistente = await this.prisma.pedido.findUnique({
      where: { id },
      include: { itens: true },
    })

    if (!pedidoExistente) {
      throw new BadRequestException('Pedido não encontrado.')
    }

    try {
      const pedidoAtualizado = await this.prisma.$transaction(async (tx) => {
        // Atualiza itens
        if (dto.itens && dto.itens.length > 0) {
          await tx.pedidoItem.deleteMany({ where: { pedidoId: id } })

          await tx.pedidoItem.createMany({
            data: dto.itens.map((item) => ({
              pedidoId: id,
              produtoId: item.produtoId,
              quantidade: item.quantidade,
              precoUnitario: new Decimal(item.precoUnitario),
              subtotal: new Decimal(item.subtotal),
            })),
          })
        }

        // Calcula total
        const totalAtualizado =
          dto.itens?.length
            ? dto.itens.reduce((acc, item) => acc + item.subtotal, 0)
            : Number(pedidoExistente.total)

        // Atualiza pedido
        const atualizado = await tx.pedido.update({
          where: { id },
          data: {
            descricao: dto.descricao ?? pedidoExistente.descricao,
            total: new Decimal(totalAtualizado),
            categoria: dto.categoria ?? pedidoExistente.categoria,
            situacao: dto.situacao ?? pedidoExistente.situacao,
            updatedAt: new Date(),
          },
          include: { itens: true },
        })

        return atualizado
      })

      return pedidoAtualizado
    } catch (error) {
      console.error('❌ Erro ao atualizar pedido:', error)
      throw new BadRequestException('Erro ao atualizar pedido.')
    }
  }

  // Listar todos pedidos
  async findAll(params: {
    status?: string
    dataInicio?: string
    dataFim?: string
    skip?: number
    take?: number
  }) {
    const where: any = {}

    if (params.status) where.status = params.status

    if (params.dataInicio && params.dataFim) {
      where.dataPedido = {
        gte: new Date(params.dataInicio),
        lte: new Date(params.dataFim),
      }
    }

    return this.prisma.pedido.findMany({
      where,
      skip: params.skip,
      take: params.take,
      include: {
        itens: { include: { produto: true } },
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  // Buscar por ID
  async findOne(id: string) {
    const pedido = await this.prisma.pedido.findUnique({
      where: { id },
      include: {
        itens: { include: { produto: true } },
      },
    })

    if (!pedido) throw new BadRequestException('Pedido não encontrado.')
    return pedido
  }

  // Remover pedido
  async remove(id: string) {
    const pedido = await this.prisma.pedido.findUnique({
      where: { id },
      include: { itens: true },
    })

    if (!pedido) throw new BadRequestException('Pedido não encontrado.')

    return this.prisma.$transaction(async (tx) => {
      await tx.pedidoItem.deleteMany({ where: { pedidoId: id } })
      return tx.pedido.delete({ where: { id } })
    })
  }
}
