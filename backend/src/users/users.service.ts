import {
  ConflictException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { hash } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async create(userDto: UserDto, user: string) {
    const validatedData = this.validateUserDto(userDto);

    const usernameExists = await this.prismaService.user.findFirst({
      where: { username: validatedData.username },
    });

    if (usernameExists)
      throw new ConflictException(
        'O nome de usuário já está em uso por outro usuário, verifique!',
      );

    const userWithSameEmail = await this.prismaService.user.findFirst({
      where: { email: validatedData.email },
    });

    if (userWithSameEmail)
      throw new ConflictException(
        'O e-mail já está em uso por outro usuário, verifique!',
      );

    return this.prismaService.user.create({
      data: {
        ...validatedData,
        password: await hash(validatedData.password, 10),
        created_by: user
      },
    });
  }

  findAll(search?: string, skip = 0, take = 10) {
    return this.prismaService.user.findMany({
      where: search ? { name: { contains: search, mode: 'insensitive' } } : {},
      skip,
      take,
    });
  }

  async findOne(id: string) {
    const user = await this.findUser(id);
    return user;
  }

  async update(id: string, userDto: UserDto) {
    await this.findUser(id);

    const validatedData = this.validateUserDto(userDto, true);

    if (validatedData.username) {
      const usernameExists = await this.prismaService.user.findFirst({
        where: {
          username: validatedData.username,
          NOT: { id },
        },
      });

      if (usernameExists)
        throw new ConflictException(
          'O nome de usuário já está em uso por outro usuário, verifique!',
        );
    }

    if (validatedData.email) {
      const userWithSameEmail = await this.prismaService.user.findFirst({
        where: {
          email: validatedData.email,
          NOT: { id },
        },
      });

      if (userWithSameEmail)
        throw new ConflictException(
          'O e-mail já está em uso por outro usuário, verifique!',
        );
    }

    const dataToUpdate: any = {
      ...validatedData,
    };

    if (validatedData.password) {
      dataToUpdate.password = await hash(validatedData.password, 10);
    } else {
      delete dataToUpdate.password;
    }

    return this.prismaService.user.update({
      where: { id },
      data: dataToUpdate,
    });
  }

  async remove(id: string) {
    await this.findUser(id);
    return this.prismaService.user.delete({
      where: { id: id.toString() },
    });
  }

  private async findUser(id: string) {
    const user = await this.prismaService.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return user;
  }

  private validateUserDto(userDto: UserDto, isUpdate: boolean = false) {
    const errors: string[] = [];

    const trimmedCpf = userDto.cpf?.trim();
    const trimmedName = userDto.name?.trim();
    const trimmedUsername = userDto.username?.trim();
    const trimmedPassword = userDto.password?.trim();

    if (!trimmedCpf && !isUpdate) {
      errors.push('CPF é obrigatório.');
    }

    if (!trimmedName && !isUpdate) {
      errors.push('Nome é obrigatório.');
    }

    if (!trimmedUsername && !isUpdate) {
      errors.push('Nome de usuário é obrigatório.');
    }

    if (!trimmedPassword && !isUpdate) {
      errors.push('Senha é obrigatória.');
    }

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    return {
      ...userDto,
      cpf: trimmedCpf,
      name: trimmedName,
      username: trimmedUsername,
      password: trimmedPassword,
      email: userDto.email?.trim() ?? null,
      phone: userDto.phone?.trim() ?? null,
      active: userDto.active ?? true,
    };
  }
}
