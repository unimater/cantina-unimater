import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
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

    if (usernameExists) throw new ConflictException('O nome de usuário já está em uso por outro usuário, verifique!');

    const userWithSameEmail = await this.prismaService.user.findFirst({
      where: { email: userDto.email?.trim() }
    });

    if (userWithSameEmail) throw new ConflictException('O e-mail já está em uso por outro usuário, verifique!');

    return this.prismaService.user.create({
      data: {
        cpf: userDto.cpf.trim(),
        name: userDto.name.trim(),
        username: userDto.username.trim(),
        password: await hash(userDto.password, 10),
        email: userDto.email?.trim() ?? null,
        phone: userDto.phone?.trim() ?? null,
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
    const user = await this.findUser(id);
    return user;
  }

  async update(id: string, userDto: UserDto) {
    await this.findUser(id);
    
    const usernameExists = await this.prismaService.user.findFirst({
      where: { 
        username: userDto.username.trim(),
        not: { id }
      }
    });

    if (usernameExists) throw new ConflictException('O nome de usuário já está em uso por outro usuário, verifique!');

    const userWithSameEmail = await this.prismaService.user.findFirst({
      where: { 
        email: userDto.email?.trim(),
        not: { id } 
      }
    });

    if (userWithSameEmail) throw new ConflictException('O e-mail já está em uso por outro usuário, verifique!');

    return this.prismaService.user.update({
      where: { id },
      data: {
        cpf: userDto.cpf.trim(),
        name: userDto.name.trim(),
        username: userDto.username.trim(),
        password: await hash(userDto.password, 10),
        email: userDto.email?.trim() ?? null,
        phone: userDto.phone?.trim() ?? null,
        active: userDto.active ?? true
      }
    });
  }

  async remove(id: string) {
    await this.findUser(id);
    return this.prismaService.user.delete({ 
      where: { id: id.toString() } 
    });
  }

  private async findUser(id: string) {
    const user = await this.prismaService.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return user;
  }
}
