import { IsNotEmpty, IsString } from 'class-validator';

export class CancelPedidoDto {
  @IsString()
  @IsNotEmpty()
  motivo: string;
}
