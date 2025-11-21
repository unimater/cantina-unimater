export class FechamentoCaixaFilters {
  periodo?: { 
    dataInicial?: string; 
    dataFinal?: string 
  };
  formasPagamento?: string[];
  produtos?: string[];
  categorias?: string[];
}

export class FechamentoCaixaResponse {
  vendas: any[];
  sumario: {
    totalLiquido: number;
    totalBruto: number;
    descontos: number;
    produtoMaisVendido?: {
      id: string;
      nome: string;
      quantidade: number;
    } | null;
    formaPagamentoMaisUsada?: {
      id: string;
      nome: string;
      quantidade: number;
    } | null;
  };
}
