import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma-service';
import { ConcluirVendaPdvDTO } from './dto/concluir-venda-pdv.dto';
import { ProdutoVendaDTO } from './dto/produto-venda.dto';

@Injectable()
export class PdvService {
  constructor(private prismaService: PrismaService) {}

  async concluirVendaPdv(concluirVendaPdvDto: ConcluirVendaPdvDTO) {
    const { produtos, usuarioId } = concluirVendaPdvDto;

    this.validarVenda(concluirVendaPdvDto);
    this.baixarEstoque(produtos, usuarioId);

    const valorLiquidoVenda =
      concluirVendaPdvDto.valorTotalVenda - concluirVendaPdvDto.valorTotalDesconto;

    const venda = await this.prismaService.venda.create({
      data: {
        valorTotalVenda: concluirVendaPdvDto.valorTotalVenda,
        valorTotalDesconto: concluirVendaPdvDto.valorTotalDesconto,
        valorLiquido: valorLiquidoVenda,
        formaPagamentoId: concluirVendaPdvDto.formaPagamentoId,
        usuarioId: concluirVendaPdvDto.usuarioId,
        createdAt: new Date().toISOString(),

        produtos: {
          create: produtos.map((p) => ({
            produto: { connect: { id: p.produtoId } },
            quantidade: p.quantidade,
          })),
        },
      },
      include: {
        produtos: {
          include: { produto: true },
        },
      },
    });

    return {
      message: 'Sucesso! A venda foi concluída com sucesso.',
      venda,
    };
  }

  private validarVenda(concluirVendaPdvDto: ConcluirVendaPdvDTO) {
    if (concluirVendaPdvDto.produtos.length === 0) throw new HttpException('Nenhum produto selecionado para venda.', 400);
    if (!concluirVendaPdvDto.formaPagamentoId) throw new HttpException('Nenhuma forma de pagamento foi informada.', 400);
  }
  
  private baixarEstoque(produtosVenda: ProdutoVendaDTO[], usuarioId: string) {
    produtosVenda.forEach(produto => {
      // const baixarPdv = new BaixarPdv(produto.produtoId, produto.quantidade, usuarioId)
      // this.prismaService.movimentacaoEstoque.baixarEstoque(baixarPdv)
      console.log("baixando estoque do produto: ", produto)
    })
  }
  
}
