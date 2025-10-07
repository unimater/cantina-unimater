import { PartialType } from '@nestjs/mapped-types';
import { CreateDespesaDto } from './create-despesa.dto';

export class UpdateDespesaDto extends PartialType(CreateDespesaDto) {
    id: string 
    descricao: string
    data: Date                                  
    valor: number              
    fornecedor: string                  
    observacoes: string 
}