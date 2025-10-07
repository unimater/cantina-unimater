export class CreateProdutoDto {
  descricao: string;       
  valor: number;           
  situacao: boolean;     
  imagem?: string;         
  categoriaId: string;    
}
