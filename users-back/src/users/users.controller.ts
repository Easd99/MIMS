import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { MessagePattern } from '@nestjs/microservices';

@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll({});
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(+id);
    if (!user) {
      throw new NotFoundException(`user not found`);
    }
    return user;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @MessagePattern('user.exists')
  checkUserExists(userId: number) {
    return this.usersService.findOne(userId);
  }

  @MessagePattern('user.byEmail')
  findByEmail(email: string) {
    return this.usersService.findAll({
      email: email,
      showPassword: true,
    });
  }

  @MessagePattern('user.validatePassword')
  validatePassword(plainText: string, hashed: string) {
    return this.usersService.validatePassword(plainText, hashed);
  }
}
