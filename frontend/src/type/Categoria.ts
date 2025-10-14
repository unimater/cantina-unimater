export interface Categoria {
  id: string;
  descricao: string;
  nome: string;
  tipo: 'PRODUTO' | 'DESPESA';
  situacao: boolean;
}
