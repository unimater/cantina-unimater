import { Injectable } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { hash } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async create(userDto: UserDto) {
    const usernameExists = await this.prismaService.user.findFirst({
      where: { username: userDto.username.trim() }
    });

    if (usernameExists) {
      throw new Error('O nome de usuário já está em uso por outro usuário, verifique!');
    }

    const userWithSameEmail = await this.prismaService.user.findMany({
      where: { email: userDto.email }
    });

    if (userWithSameEmail) {
      throw new Error('O e-mail já está em uso por outro usuário, verifique!');
    }

    const hashedPassword = await hash(userDto.password, 10);

    return this.prismaService.user.create({
      data: {
        cpf: userDto.cpf,
        name: userDto.name,
        username: userDto.username,
        password: hashedPassword,
        email: userDto.email,
        phone: userDto.phone,
        active: userDto.active ?? true
      }
    });
  }

  findAll(search?: string, skip = 0, take = 10) {
    return this.prismaService.user.findMany({
      where: search ? { name: { contains: search, mode: 'insensitive' } } : {},
      skip,
      take
    });
  }

  async findOne(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id }
    });
    if (!user) throw new Error('Usuário não encontrado');
    return user;
  }

  async update(id: string, userDto: UserDto) {
    userDto.password = await hash(userDto.password, 10);

    return this.prismaService.user.update({
      where: { id },
      data: userDto,
    });
  }

  remove(id: string) {
    return this.prismaService.user.delete({ 
      where: { id: id.toString() } 
    });
  }
}
