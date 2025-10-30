export type Estoque = {
    id?: string;
    tipo: 'ENTRADA' | 'SAIDA';
    motivo: string;
    quantidade: number;
    observacoes?: string;
    produto: {descricao: string; id: string;};
    usuario: {name: string; id: string;};
    createdAt?: string;
}