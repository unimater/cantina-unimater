import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Produto, Venda } from '../../generated/prisma'; 
import { ProdutoMaisVendido } from './dto/produto-mais-vendido.dto';

@Injectable()
export class VendaService {
  constructor(private prismaService: PrismaService) {}

  async findAllVendas(): Promise<Venda[]> {
    return this.prismaService.venda.findMany({
      include: {
        produtos: true,
        formaPagamento: true,
      },
    });
  }

  async findProdutosMaisVendidos(): Promise<ProdutoMaisVendido[]> {
    const produtos = await this.prismaService.vendaProduto.groupBy({
      by: ['produtoId'],
      _sum: {
        quantidade: true,
      },
      orderBy: {
        _sum: {
          quantidade: 'desc',
        },
      },
    });

    const top5 = produtos.slice(0, 5);

    const result = await Promise.all(
      top5.map(async (p) => {
        const produtoInfo = await this.prismaService.produto.findUnique({
          where: { id: p.produtoId },
        });

        return {
          produtoId: p.produtoId,
          produto: produtoInfo,
          quantidadeVendida: p._sum.quantidade || 0,
        };
      })
    );

    return result;
  }
  
}
