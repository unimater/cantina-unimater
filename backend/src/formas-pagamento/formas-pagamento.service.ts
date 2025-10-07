import { HttpException, Injectable } from '@nestjs/common';
import { CreateFormasPagamentoDto } from './dto/create-formas-pagamento.dto';
import { UpdateFormasPagamentoDto } from './dto/update-formas-pagamento.dto';
import { PrismaService } from 'src/prisma/prisma-service';

@Injectable()
export class FormasPagamentoService {
  constructor(private prismaService: PrismaService) {}

   async create(createFormasPagamentoDto: CreateFormasPagamentoDto) {
    const { name, status } = createFormasPagamentoDto;

    if (!name) {
      throw new HttpException('O campo "name" é obrigatório', 400);
    }

    return this.prismaService.formasPagamento.create({
      data: { name, status },
    });
  }

  findAll() {
    return this.prismaService.formasPagamento.findMany();
  }

  async findOne(id: string) {
    const retorno = await this.prismaService.formasPagamento.findUnique({
      where: { id },
    });
    if (!retorno) {
      throw new HttpException('Forma de pagamento não encontrada', 404);
    } else {
      return retorno;
    }
  }

async update(id: string, updateFormasPagamentoDto: UpdateFormasPagamentoDto) {
    const { name, status } = updateFormasPagamentoDto;

    if (!name) {
      throw new HttpException('O campo "name" é obrigatório', 400);
    }
    
    await this.findOne(id);

    return this.prismaService.formasPagamento.update({
      where: { id },
      data: { name, status },
    });
  }


  async remove(id: string) {
    await this.findOne(id);

    await this.prismaService.formasPagamento.delete({
        where: { id },
      });
  }
}
