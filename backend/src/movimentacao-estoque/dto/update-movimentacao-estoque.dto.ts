import { PartialType } from '@nestjs/mapped-types';
import { CreateMovimentacaoEstoqueDto } from './create-movimentacao-estoque.dto';

export class UpdateMovimentacaoEstoqueDto extends PartialType(CreateMovimentacaoEstoqueDto) {}
