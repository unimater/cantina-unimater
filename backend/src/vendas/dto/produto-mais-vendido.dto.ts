import { Produto } from "generated/prisma";

export class ProdutoMaisVendido {
  produtoId: string;
  produto: Produto | null;
  quantidadeVendida: number;
};
