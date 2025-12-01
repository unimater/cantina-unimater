export class ItemEstoqueDto {
  id: string;
  produto: string;
  quantidade: number;
  quantidadeMin: number;
  status: 'Esgotado' | 'Baixo estoque' | 'Disponível';
}
