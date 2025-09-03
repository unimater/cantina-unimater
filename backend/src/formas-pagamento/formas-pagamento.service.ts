import { HttpException, Injectable } from '@nestjs/common';
import { CreateFormasPagamentoDto } from './dto/create-formas-pagamento.dto';
import { UpdateFormasPagamentoDto } from './dto/update-formas-pagamento.dto';
import { PrismaService } from 'src/prisma/prisma-service';

@Injectable()
export class FormasPagamentoService {
  constructor(private prismaService: PrismaService) {}

  async create(createFormasPagamentoDto: CreateFormasPagamentoDto) {
    await this.prismaService.formasPagamento.create({
      data: {
        name: createFormasPagamentoDto.name,
        status: createFormasPagamentoDto.status,
      },
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
    await this.prismaService.formasPagamento.update({
      where: { id },
      data: {
        name: updateFormasPagamentoDto.name,
        status: updateFormasPagamentoDto.status,
      },
    });
  }

  async remove(id: string) {
    const retorno = await this.prismaService.formasPagamento.findUnique({
      where: { id }
    })

    if (!retorno) {
      throw new HttpException('Forma de pagamento não encontrada', 404);
    } else {
      const retorno = await this.prismaService.formasPagamento.delete({
        where: { id },
      });
    }
  }
}
