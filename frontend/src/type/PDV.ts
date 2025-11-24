export interface ProdutoVenda {
    produtoId: string
    quantidade: number
    valorUnitario: number
}

export interface ConcluirVendaPDV {
    produtos: ProdutoVenda[]
    valorTotalVenda: number
    valorTotalDesconto: number
    formaPagamentoId: string
    usuarioId: string
}
