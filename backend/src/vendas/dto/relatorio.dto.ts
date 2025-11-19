export class RelatorioFilters {
  periodo?: { startDate?: string; endDate?: string };
  formasPagamento?: string[];
  produtos?: string[];
  categorias?: string[];
}

export class RelatorioResponse {
  vendas: any[];
  summary: {
    total: number;
    mostSold?: any;
    mostUsedPayment?: any;
  };
}
