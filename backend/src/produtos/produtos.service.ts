import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProdutosService {
    constructor(private readonly prisma: PrismaService) { }

    async create(dto: CreateProdutoDto, user: string) {
        const { descricao, valor, situacao, imagem, categoriaId } = dto;

        if (!descricao || valor === undefined || !categoriaId) {
            throw new BadRequestException(
                'Não foi possível salvar o registro! Preencha os campos obrigatórios (descrição, valor e categoria).',
            );
        }

        const existe = await this.prisma.produto.findFirst({
            where: {
                descricao: { equals: descricao.trim(), mode: 'insensitive' },
            },
        });

        if (existe) {
            throw new BadRequestException(
                'Não foi possível salvar o registro! Já existe um produto com a mesma descrição.',
            );
        }

        const data: any = {
            descricao,
            valor,
            situacao: situacao ?? true,
            categoriaId,
            createdBy: user
        };

        if (imagem) {
            data.imagem = imagem;
        }

        const produto = await this.prisma.produto.create({
            data,
            include: { categoria: true },
        });

        return {
            message: 'Sucesso! Produto criado com sucesso.',
            produto,
        };
    }

    async findAll(filtro?: string) {
        return this.prisma.produto.findMany({
            where: filtro
                ? { descricao: { contains: filtro, mode: 'insensitive' } }
                : undefined,
            orderBy: { descricao: 'asc' },
            include: { categoria: true },
        });
    }

    async findOne(id: string) {
        const produto = await this.prisma.produto.findUnique({
            where: { id },
            include: { categoria: true },
        });

        if (!produto) throw new NotFoundException(`Produto #${id} não encontrado`);

        return produto;
    }

    async update(id: string, dto: UpdateProdutoDto) {
        await this.findOne(id);

        const data: any = {};
        if (dto.descricao) data.descricao = dto.descricao;
        if (dto.valor !== undefined) data.valor = dto.valor;
        if (dto.situacao !== undefined) data.situacao = dto.situacao;
        if (dto.imagem !== undefined) data.imagem = dto.imagem;
        if (dto.categoriaId) data.categoriaId = dto.categoriaId;

        return this.prisma.produto.update({
            where: { id },
            data,
            include: { categoria: true },
        });
    }

    async remove(id: string) {
        await this.findOne(id);

        return this.prisma.produto.delete({ where: { id } });
    }
}
