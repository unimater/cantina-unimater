import api from './api';

export interface ResumoFinanceiro {
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
  periodo: string;
}

export interface ProdutoMaisVendido {
  produto: string;
  quantidade: number;
}

export interface VendaPorFormaPagamento {
  formaPagamento: string;
  valor: number;
  percentual: number;
  [key: string]: string | number;
}

export interface ItemEstoque {
  id: string;
  produto: string;
  quantidade: number;
  status: 'Esgotado' | 'Baixo estoque' | 'Disponível';
}

export const dashboardApi = {
  getResumoFinanceiro: async (periodo: 'hoje' | 'semana' | 'mes' = 'hoje') => {
    const response = await api.get<ResumoFinanceiro>(`/dashboard/resumo?periodo=${periodo}`);
    return response.data;
  },

  getProdutosMaisVendidos: async (limite: number = 5) => {
    const response = await api.get<ProdutoMaisVendido[]>(
      `/dashboard/produtos-mais-vendidos?limite=${limite}`,
    );
    return response.data;
  },

  getVendasPorFormaPagamento: async () => {
    const response = await api.get<VendaPorFormaPagamento[]>(
      '/dashboard/vendas-por-forma-pagamento',
    );
    return response.data;
  },

  getControleEstoque: async () => {
    const response = await api.get<ItemEstoque[]>('/dashboard/controle-estoque');
    return response.data;
  },
};
