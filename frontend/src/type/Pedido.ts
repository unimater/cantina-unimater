export type PedidoItem = {
  id?: string;
  pedidoId?: string;
  produtoId: string;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
  produto?: {
    id: string;
    descricao: string;
    valor: number | string;
    imagem?: string | null;
  };
};

export type Pedido = {
  id: string;
  descricao: string;
  total: number | string;
  categoria?: 'PRODUTO' | 'DESPESA' | string;
  situacao?: boolean;
  status?: 'FINALIZADO' | 'CANCELADO' | string;
  dataPedido?: string;
  itens?: PedidoItem[]; // <- aqui estava faltando
  createdAt?: string;
  updatedAt?: string | null;
  // (adicione outros campos conforme seu backend retorna)
};
