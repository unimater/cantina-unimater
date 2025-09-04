import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoriaDto } from './create-categoria.dto';
import { TipoCategoria } from 'generated/prisma';

export class UpdateCategoriaDto extends PartialType(CreateCategoriaDto) {
    id: string
    descricao: string
    tipo: TipoCategoria
    situacao: boolean
}
