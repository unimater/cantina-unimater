

export interface Pedido {
  id: string;
  descricao: string;
  valorTotal: number;
  situacao: boolean;
  categoria: string; // VERIFICAR PQ NAO FICOU AZUL
  createdAt: string;
  updatedAt?: string;
}
