import { PartialType } from '@nestjs/mapped-types';
import { CreateFormasPagamentoDto } from './create-formas-pagamento.dto';

export class UpdateFormasPagamentoDto extends PartialType(CreateFormasPagamentoDto) {}
