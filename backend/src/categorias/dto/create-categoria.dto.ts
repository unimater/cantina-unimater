import { TipoCategoria } from "generated/prisma"

export class CreateCategoriaDto {
    descricao: string
    tipo: TipoCategoria
    situacao: boolean
}
