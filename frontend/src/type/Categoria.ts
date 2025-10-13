export interface Categoria {
  id: number;
  descricao: string;
  tipo: 'PRODUTO' | 'DESPESA';
  situacao: boolean;
}
