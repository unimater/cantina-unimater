import { IsString, IsNumber, IsOptional, IsBoolean, MaxLength, Min } from 'class-validator';

export class UpdatePedidoDto {
  @IsOptional()
  @IsString()
  @MaxLength(150)
  descricao?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  total?: number;

  @IsOptional()
  @IsString()
  categoria?: string;

  @IsOptional()
  @IsBoolean()
  situacao?: boolean;
}
