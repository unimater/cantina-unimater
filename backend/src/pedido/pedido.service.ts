import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { Prisma } from '../../generated/prisma';
import { isSameDay } from 'date-fns';

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
          categoria: dto.categoria ?? 'PRODUTO',
          situacao: dto.situacao ?? true,
          createdAt: new Date(),
        },
      });

      return pedido;
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      throw new BadRequestException('Erro ao criar pedido');
    }
  }

  // ✅ Atualizar pedido
  async update(id: string, dto: UpdatePedidoDto) {
    const pedido = await this.prisma.pedido.findUnique({ where: { id } });
    if (!pedido) throw new BadRequestException('Pedido não encontrado.');

    try {
      return await this.prisma.pedido.update({
        where: { id },
        data: {
          descricao: dto.descricao ?? pedido.descricao,
          total: dto.total ?? pedido.total,
          categoria: dto.categoria ?? pedido.categoria,
          situacao: dto.situacao ?? pedido.situacao,
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      console.error('Erro ao atualizar pedido:', error);
      throw new BadRequestException('Erro ao atualizar pedido.');
    }
  }

  // ✅ Listagem
  async findAll(params: {
    status?: string;
    dataInicio?: Date;
    dataFim?: Date;
    skip?: number;
    take?: number;
  }) {
    const where: Prisma.PedidoWhereInput = {};

    if (params.status) where.status = params.status as any;
    if (params.dataInicio && params.dataFim)
      where.dataPedido = { gte: params.dataInicio, lte: params.dataFim };

    return this.prisma.pedido.findMany({
      where,
      skip: params.skip,
      take: params.take,
      orderBy: { createdAt: 'desc' },
    });
  }

  // ✅ Buscar pedido por ID
  async findOne(id: string) {
    const pedido = await this.prisma.pedido.findUnique({
      where: { id },
    });

    if (!pedido) throw new BadRequestException('Pedido não encontrado');
    return pedido;
  }

  // ✅ Remover pedido
  async remove(id: string) {
    const pedido = await this.prisma.pedido.findUnique({
      where: { id },
      include: { itens: true },
    });

    if (!pedido) {
      throw new BadRequestException('Pedido não encontrado.');
    }

    if (pedido.itens && pedido.itens.length > 0) {
      await this.prisma.pedidoItem.deleteMany({
        where: { pedidoId: id },
      });
    }

    return this.prisma.pedido.delete({
      where: { id },
    });
  }
}
