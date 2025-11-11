export interface Pedido {
  id: string;
  descricao: string;
  total: number; 
  situacao: boolean;
  categoria?: string;
  status?: string;
  dataPedido?: string;
  createdAt?: string;
  updatedAt?: string;
}
