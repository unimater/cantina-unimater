import { ProdutoVendaDTO } from "src/pdv/dto/produto-venda.dto"

export class VendaDTO {
    id: string
    produtos: ProdutoVendaDTO[]
    valorTotalVenda: number
    valorTotalDesconto: number
    valorLiquido: number
    formaPagamentoId: string
    usuarioId: string
    createdAt: string
    updatedAt: string
}
