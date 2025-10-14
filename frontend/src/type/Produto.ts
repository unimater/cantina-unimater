import type { Categoria } from "./Categoria";

export interface Produto {
  id: number;
  descricao: string;
  valor: number;
  situacao: boolean;
  imagem?: string;
  categoria: Categoria;
  createdAt: string;
  updatedAt?: string
}
