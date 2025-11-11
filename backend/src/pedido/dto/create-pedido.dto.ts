import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  ValidateNested,
  IsArray,
  Min,
} from 'class-validator'
import { Type } from 'class-transformer'

/**
 * Representa um item dentro do pedido.
 */
class PedidoItemDto {
  @IsString({ message: 'O ID do produto é obrigatório.' })
  produtoId: string

  @IsNumber({}, { message: 'A quantidade deve ser um número.' })
  @Min(1, { message: 'A quantidade mínima é 1.' })
  quantidade: number

  @IsNumber({}, { message: 'O preço unitário deve ser um número.' })
  precoUnitario: number

  @IsNumber({}, { message: 'O subtotal deve ser um número.' })
  subtotal: number
}

/**
 * DTO principal do Pedido.
 */
export class CreatePedidoDto {
  @IsString({ message: 'A descrição é obrigatória.' })
  descricao: string

  @IsNumber({}, { message: 'O total deve ser um número válido.' })
  total: number

  @IsOptional()
  @IsString({ message: 'A categoria deve ser um texto.' })
  categoria?: string

  @IsOptional()
  @IsBoolean({ message: 'A situação deve ser verdadeira ou falsa.' })
  situacao?: boolean

  @IsArray({ message: 'Os itens devem ser enviados como uma lista.' })
  @ValidateNested({ each: true })
  @Type(() => PedidoItemDto)
  itens: PedidoItemDto[]
}
