export type Estoque = {
    id?: string;
    tipo: 'ENTRADA' | 'SAIDA';
    produtoId?: string;
    usuarioId: string
    motivo: string;
    quantidade: string;
    observacoes?: string;
    produto?: {descricao: string; id: string; quantidadeEstoque:string; estoqueMinimo: string};
    usuario?: {name: string; id: string;};
    createdAt?: string;
}