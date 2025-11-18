import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoriasService {
    constructor(private readonly prisma: PrismaService) { }

    // Criar categoria
    async create(createCategoriaDto: CreateCategoriaDto, user: string) {
        const { descricao, tipo, situacao } = createCategoriaDto;

        if (!descricao || !tipo) {
            throw new BadRequestException(
                'Não foi possível salvar o registro! Preencha os campos obrigatórios para salvar o registro',
            );
        }

        const descricaoNormalizada = descricao.trim().toLowerCase();

        const existe = await this.prisma.categoria.findFirst({
            where: {
                descricao: { equals: descricaoNormalizada, mode: 'insensitive' },
            },
        });

        if (existe) {
            throw new BadRequestException(
                'Não foi possível salvar o registro! Já existe uma categoria com a mesma descrição, verifique!',
            );
        }

        const categoria = await this.prisma.categoria.create({
            data: {
                descricao,
                tipo,
                situacao: situacao ?? true,
                createdBy: user
            },
        });

        return {
            message: 'Sucesso! A categoria foi incluída com sucesso.',
            categoria,
        };
    }

    // Listar todas categorias
    async findAll(filtro?: string) {
        return this.prisma.categoria.findMany({
            where: filtro
                ? {
                    descricao: { contains: filtro, mode: 'insensitive' },
                }
                : undefined,
            orderBy: { id: 'asc' },
        });
    }

    // Buscar categoria por ID
    async findOne(id: string) {
        const categoria = await this.prisma.categoria.findUnique({
            where: { id },
        });

        if (!categoria) {
            throw new NotFoundException(`Categoria #${id} não encontrada`);
        }

        return categoria;
    }

    // Atualizar categoria
    async update(id: string, updateCategoriaDto: UpdateCategoriaDto) {
        await this.findOne(id);

        const { descricao, tipo, situacao } = updateCategoriaDto;

        const data: any = {};

        if (descricao) {
            const descricaoNormalizada = descricao.trim().toLowerCase();

            const existe = await this.prisma.categoria.findFirst({
                where: {
                    descricao: { equals: descricaoNormalizada, mode: 'insensitive' },
                    NOT: { id },
                },
            });

            if (existe) {
                throw new BadRequestException(
                    'Não foi possível salvar o registro! Já existe uma categoria com a mesma descrição, verifique!',
                );
            }

            data.descricao = descricao;
        }

        if (tipo) data.tipo = tipo;
        if (situacao !== undefined) data.situacao = situacao;

        return this.prisma.categoria.update({
            where: { id },
            data,
        });
    }

    // Remover categoria
    async remove(id: string) {
        await this.findOne(id);

        const emUso = await this.prisma.produto.findFirst({
            where: { categoriaId: id },
        });

        if (emUso) {
            throw new BadRequestException(
                'Não foi possível salvar o registro! O item já está em uso em algum registro.',
            );
        }

        return this.prisma.categoria.delete({
            where: { id },
        });
    }
}
