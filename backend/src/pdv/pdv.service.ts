import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConcluirVendaPdvDTO } from './dto/concluir-venda-pdv.dto';
import { ProdutoVendaDTO } from './dto/produto-venda.dto';
import { MovimentacaoEstoqueService } from 'src/movimentacao-estoque/movimentacao-estoque.service';

@Injectable()
export class PdvService {
  constructor(private prismaService: PrismaService, private movimentacaoEstoqueService: MovimentacaoEstoqueService) {}

  async concluirVendaPdv(concluirVendaPdvDto: ConcluirVendaPdvDTO) {
    const { produtos, usuarioId } = concluirVendaPdvDto;

    this.validarVenda(concluirVendaPdvDto);

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

    await this.baixarEstoque(produtos, usuarioId);

    return {
      message: 'Sucesso! A venda foi concluída com sucesso.',
      venda,
    };
  }

  private validarVenda(concluirVendaPdvDto: ConcluirVendaPdvDTO) {
    if (concluirVendaPdvDto.produtos.length === 0) throw new HttpException('Nenhum produto selecionado para venda.', 400);
    if (!concluirVendaPdvDto.formaPagamentoId) throw new HttpException('Nenhuma forma de pagamento foi informada.', 400);
  }
  
  private async baixarEstoque(produtosVenda: ProdutoVendaDTO[], usuarioId: string) {
    for (const produto of produtosVenda) {
      const baixarPdv = { 
        produtoId: produto.produtoId, 
        quantidade: produto.quantidade, 
        usuarioId 
      };

      await this.movimentacaoEstoqueService.baixarEstoque(baixarPdv);
    }
  }
  
}
