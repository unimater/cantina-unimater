import { ProdutoVendaDTO } from "./produto-venda.dto"

export class ConcluirVendaPdvDTO {
    produtos: ProdutoVendaDTO[]
    valorTotalVenda: number
    valorTotalDesconto: number
    formaPagamentoId: string
}
