import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDespesaDto } from './dto/create-despesa.dto';
import { UpdateDespesaDto } from './dto/update-despesa.dto';

@Injectable()
export class DespesasService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.despesa.findMany({
      orderBy: { data: 'desc' },
    });
  }

  async findOne(id: string) {
    const despesa = await this.prisma.despesa.findUnique({
      where: { id },
    });

    if (!despesa) {
      throw new NotFoundException(`Despesa com ID ${id} não encontrada`);
    }

    return despesa;
  }

  async create(createDespesaDto: CreateDespesaDto) {
    const dataDespesa = new Date(createDespesaDto.data);

    if (dataDespesa > new Date()) {
      throw new BadRequestException('Não é permitido informar uma data futura.');
    }

    try {
      const despesa = await this.prisma.despesa.create({
        data: {
          descricao: createDespesaDto.descricao,
          data: dataDespesa,
          valor: createDespesaDto.valor,
          fornecedor: createDespesaDto.fornecedor,
          observacoes: createDespesaDto.observacoes,
        },
      });

      return {
        message: 'Sucesso! A despesa foi incluída com sucesso.',
        data: despesa,
      };
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException(
          'Não foi possível salvar o registro! Já existe uma despesa com a mesma descrição.',
        );
      }
      throw error;
    }
  }

  async update(id: string, updateDespesaDto: UpdateDespesaDto) {
    // valida data somente se enviada
    if (updateDespesaDto.data) {
      const dataDespesa = new Date(updateDespesaDto.data);
      if (dataDespesa > new Date()) {
        throw new BadRequestException('Não é permitido informar uma data futura.');
      }
    }

    try {
      // constrói objeto de atualização apenas com campos enviados
      const updateData: any = {};

      if (updateDespesaDto.descricao !== undefined) {
        updateData.descricao = updateDespesaDto.descricao;
      }
      if (updateDespesaDto.data !== undefined) {
        updateData.data = new Date(updateDespesaDto.data);
      }
      if (updateDespesaDto.valor !== undefined) {
        updateData.valor = updateDespesaDto.valor;
      }
      if (updateDespesaDto.fornecedor !== undefined) {
        updateData.fornecedor = updateDespesaDto.fornecedor;
      }
      if (updateDespesaDto.observacoes !== undefined) {
        updateData.observacoes = updateDespesaDto.observacoes;
      }

      const despesa = await this.prisma.despesa.update({
        where: { id },
        data: updateData,
      });

      return {
        message: 'Sucesso! A despesa foi atualizada.',
        data: despesa,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Despesa com ID ${id} não encontrada`);
      }
      if (error.code === 'P2002') {
        throw new BadRequestException(
          'Não foi possível salvar o registro! Já existe uma despesa com a mesma descrição, verifique!',
        );
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.despesa.delete({
        where: { id },
      });
      return { message: 'Despesa removida com sucesso.' };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Despesa com ID ${id} não encontrada`);
      }
      throw error;
    }
  }
}