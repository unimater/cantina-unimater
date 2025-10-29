import type { Categoria } from "./Categoria";

export interface Produto {
  id: string | null;
  descricao: string;
  valor: number;
  situacao: boolean;
  imagem?: string;
  categoria: Categoria;
  createdAt: string;
  updatedAt?: string
}
