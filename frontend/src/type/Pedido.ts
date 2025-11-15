import type { Produto } from "./Produto";

export enum Status {
  PENDENTE = 'Pendente',
  ENTREGUE = 'Entregue',
  CANCELADO = 'Cancelado'
}

export interface Pedido {
  id: number;
  numero: number;
  status: Status;
  produtos : Produto[];
  descontoTotal: number;
  formaPagamento: string;
  valorTotal: number;
  createdAt: string;
  updatedAt?: string
}
