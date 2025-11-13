export interface Categoria {
  id?: string;
  descricao: string;
  tipo: 'PRODUTO' | 'DESPESA';
  situacao: boolean;
}
