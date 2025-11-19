export class RelatorioFilters {
  periodo?: { startDate?: string; endDate?: string };
  formasPagamento?: string[];
  produtos?: string[];
  categorias?: string[];
}

export class RelatorioResponse {
  vendas: any[];
  summary: {
    netTotal: number;
    grossTotal: number;
    discounts: number;
    mostSold?: any;
    mostUsedPayment?: any;
  };
}
