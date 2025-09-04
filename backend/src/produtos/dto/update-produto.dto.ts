import { PartialType } from '@nestjs/mapped-types';
import { CreateProdutoDto } from './create-produto.dto';

export class UpdateProdutoDto extends PartialType(CreateProdutoDto) {
    descricao?: string;
    valor?: number;
    situacao?: boolean;
    imagem?: string;
    categoriaId?: string;
}

