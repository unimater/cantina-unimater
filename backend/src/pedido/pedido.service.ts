import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { CancelPedidoDto } from './dto/cancel-pedido.dto';
import { FindAllPedidosDto } from './dto/find-all-pedidos.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class PedidoService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreatePedidoDto) {
    if (!dto.itens || dto.itens.length === 0) {
      throw new BadRequestException('O pedido deve conter pelo menos um item.');
    }

    const itensData = dto.itens.map((item) => {
      const subtotal = item.precoUnitario * item.quantidade;
      return {
        produtoId: item.produtoId,
        quantidade: item.quantidade,
        precoUnitario: item.precoUnitario,
        subtotal,
      };
    });

    const total = itensData.reduce((acc, item) => acc + Number(item.subtotal), 0);

    return this.prisma.pedido.create({
      data: {
        descricao: dto.descricao ?? 'Pedido balcão',
        total,
        status: 'FINALIZADO',
        dataPedido: new Date(),
        formaPagamentoId: dto.formaPagamentoId ?? null,
        itens: {
          create: itensData,
        },
      },
      include: {
        formaPagamento: true,
        itens: {
          include: {
            produto: true,
          },
        },
      },
    });
  }

  async findAll(query: FindAllPedidosDto) {
    const { page = 1, limit = 10, status, formaPagamentoId, dataInicial, dataFinal } = query;

    const skip = (page - 1) * Number(limit);

    const where: Record<string, any> = {};

    if (status) where.status = status;
    if (formaPagamentoId) where.formaPagamentoId = formaPagamentoId;

    if (dataInicial || dataFinal) {
      where.dataPedido = {};
      if (dataInicial) {
        where.dataPedido.gte = new Date(dataInicial);
      }
      if (dataFinal) {
        const fim = new Date(dataFinal);
        fim.setHours(23, 59, 59, 999);
        where.dataPedido.lte = fim;
      }
    }

    const [items, total] = await Promise.all([
      this.prisma.pedido.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { dataPedido: 'desc' },
        include: {
          formaPagamento: true,
        },
      }),
      this.prisma.pedido.count({ where }),
    ]);

    return {
      data: items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const pedido = await this.prisma.pedido.findUnique({
      where: { id },
      include: {
        formaPagamento: true,
        itens: {
          include: {
            produto: true,
          },
        },
      },
    });

    if (!pedido) {
      throw new NotFoundException('Pedido não encontrado.');
    }

    return pedido;
  }

  async update(id: string, dto: UpdatePedidoDto) {
    await this.ensureExists(id);

    return this.prisma.pedido.update({
      where: { id },
      data: {
        descricao: dto.descricao,
        formaPagamentoId: dto.formaPagamentoId,
      },
    });
  }

  async cancel(id: string, dto: CancelPedidoDto) {
    const pedido = await this.prisma.pedido.findUnique({
      where: { id },
      include: { itens: true },
    });

    if (!pedido) throw new NotFoundException('Pedido não encontrado.');
    if (pedido.status === 'CANCELADO') throw new BadRequestException('Pedido já está cancelado.');

    const hoje = new Date();
    const mesmaData =
      pedido.dataPedido.getDate() === hoje.getDate() &&
      pedido.dataPedido.getMonth() === hoje.getMonth() &&
      pedido.dataPedido.getFullYear() === hoje.getFullYear();

    if (!mesmaData) {
      throw new BadRequestException('Só é permitido cancelar pedidos do dia atual.');
    }

    return this.prisma.pedido.update({
      where: { id },
      data: {
        status: 'CANCELADO',
        motivoCancelamento: dto.motivo,
        dataCancelamento: new Date(),
      },
    });
  }

  async remove(id: string) {
    await this.ensureExists(id);

    await this.prisma.pedido.delete({ where: { id } });

    return true;
  }

  private async ensureExists(id: string) {
    const pedido = await this.prisma.pedido.findUnique({ where: { id } });
    if (!pedido) throw new NotFoundException('Pedido não encontrado.');
  }
}
