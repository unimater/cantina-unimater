import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class CreatePedidoItemDto {
  @IsUUID()
  @IsNotEmpty()
  produtoId: string;

  @IsNumber()
  @Min(1)
  quantidade: number;

  @IsNumber()
  @Min(0)
  precoUnitario: number;
}

export class CreatePedidoDto {
  @IsString()
  @IsOptional()
  descricao?: string;

  @IsUUID()
  @IsOptional()
  formaPagamentoId?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePedidoItemDto)
  @IsNotEmpty()
  itens: CreatePedidoItemDto[];
}
