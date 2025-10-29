export class CreateMovimentacaoEstoqueDto {
    produtoId: string
    usuarioId: string
    tipo: 'ENTRADA' | 'SAIDA';
    motivo: string
    quantidade: number
    estoqueAnterior: number
    estoqueAtual: number
    observacoes?: string
}
