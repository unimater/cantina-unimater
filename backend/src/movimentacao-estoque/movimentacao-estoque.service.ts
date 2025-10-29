import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMovimentacaoEstoqueDto } from './dto/create-movimentacao-estoque.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MovimentacaoEstoqueService {
  constructor(private prismaService: PrismaService) {}

  async registrarMovimentacao(CreateMovimentacaoEstoqueDto: CreateMovimentacaoEstoqueDto) {
    const { 
      produtoId, 
      usuarioId, 
      tipo, 
      motivo, 
      quantidade, 
      observacoes 
    } = CreateMovimentacaoEstoqueDto;

    const usuario = await this.prismaService.user.findUnique({
      where: {
        id: usuarioId
      }
    })

    if (!usuario) {
      throw new BadRequestException(`Usuário ${usuarioId} não foi encontrado`)
    };

    const produto = await this.prismaService.produto.findUnique({ 
      where: {
        id: produtoId
      }
    });

    if (!produto) {
      throw new BadRequestException(`Produto ${produtoId} não foi encontrado`)
    };

    const estoqueAnterior = produto.quantidadeEstoque;
    let estoqueAtual = estoqueAnterior;

    if (tipo === 'ENTRADA') 
      estoqueAtual = estoqueAtual.add(quantidade);
      else if (tipo === 'SAIDA') {
        if (estoqueAnterior.lt(quantidade))
          throw new BadRequestException('Estoque insuficiente.');
        estoqueAtual = estoqueAtual.sub(quantidade);
    } else {
        throw new BadRequestException('Tipo de movimentação inválido.');
    }

    await this.prismaService.produto.update({
        where: { id: produtoId },
        data: { quantidadeEstoque: estoqueAtual },
    });


    await this.prismaService.movimentacaoEstoque.create({
      data: {
        produto: { connect: { id: produtoId } },
        usuario: { connect: { id: usuarioId } },
        tipo, 
        motivo, 
        quantidade, 
        estoqueAnterior, 
        estoqueAtual, 
        observacoes 
      },
      include: { 
        produto: true, 
        usuario: true 
      },
    })
  }

  listarMovimentacoes(filtros: {
    tipo?: 'ENTRADA' | 'SAIDA';
    produtoId?: string;
    usuarioId?: string;
    dataInicio?: string;
    dataFim?: string;
  }) {
    const where: any = {};

    if (filtros.tipo) where.tipo = filtros.tipo;
    if (filtros.produtoId) where.produtoId = filtros.produtoId;
    if (filtros.usuarioId) where.usuarioId = filtros.usuarioId;

    return this.prismaService.movimentacaoEstoque.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  listarEstoque(){
    return this.prismaService.produto.findMany({
      where: {
        quantidadeEstoque: { gt: 0 }
      }
    })
  }

  async baixarEstoque(bodyBaixaPdv: { produtoId: string, quantidade: number, usuarioId: string }) {
    const { produtoId, quantidade, usuarioId } = bodyBaixaPdv

    if (!produtoId || !quantidade || !usuarioId || quantidade === 0) {
      throw new BadRequestException("Valores obrigatórios invalidos")
    }

    const usuario = await this.prismaService.user.findUnique({
      where: {
        id: usuarioId
      }
    })

    if (!usuario) {
      throw new BadRequestException(`Usuário ${usuarioId} não foi encontrado`)
    };

    const produto = await this.prismaService.produto.findUnique({ 
      where: {
        id: produtoId
      }
    });

    if (!produto) {
      throw new BadRequestException(`Produto ${produtoId} não foi encontrado`)
    };



    const estoqueAnterior = produto.quantidadeEstoque

    if (estoqueAnterior.lt(quantidade))
        throw new BadRequestException('Estoque insuficiente.');

    const estoqueAtual = estoqueAnterior.sub(quantidade);

    await this.prismaService.produto.update({
      where: {id: produtoId},
      data: { quantidadeEstoque: estoqueAtual}
    })

    await this.prismaService.movimentacaoEstoque.create({
        data: {
          tipo: 'SAIDA',
          motivo: 'Venda PDV',
          quantidade,
          estoqueAnterior,
          estoqueAtual,
          produto: { connect: { id: produtoId } },
          usuario: { connect: { id: usuarioId } },
        },
    });
  }
}
