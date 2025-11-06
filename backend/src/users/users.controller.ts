import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CurrentUser } from 'src/auth/current-user-decorator';
import type { UserAuthPayload } from 'src/auth/jwt.strategy';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() userDto: UserDto, @CurrentUser() user: UserAuthPayload) {
    console.log('user', user.sub);
    return this.usersService.create(userDto);
  }

  @Get()
  findAll(
    @Query('search') search?: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    return this.usersService.findAll(
      search,
      skip ? parseInt(skip, 10) : 0,
      take ? parseInt(take, 10) : 10,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() userDto: UserDto, @CurrentUser() user: UserAuthPayload) {
    console.log('user', user.sub);
    return this.usersService.update(id, userDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: UserAuthPayload) {
    console.log('user', user.sub);
    return this.usersService.remove(id);
  }
}
