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

class UpdatePedidoItemDto {
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

export class UpdatePedidoDto {
  @IsOptional()
  @IsString({ message: 'A descrição deve ser um texto.' })
  descricao?: string

  @IsOptional()
  @IsNumber({}, { message: 'O total deve ser um número válido.' })
  total?: number

  @IsOptional()
  @IsString({ message: 'A categoria deve ser um texto.' })
  categoria?: string

  @IsOptional()
  @IsBoolean({ message: 'A situação deve ser booleana.' })
  situacao?: boolean

  // itens opcionais — quando enviados serão usados para recriar os itens do pedido
  @IsOptional()
  @IsArray({ message: 'Os itens devem ser uma lista.' })
  @ValidateNested({ each: true })
  @Type(() => UpdatePedidoItemDto)
  itens?: UpdatePedidoItemDto[]
}
