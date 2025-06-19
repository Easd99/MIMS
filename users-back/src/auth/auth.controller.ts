import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('login')
  async login(@Body() body: AuthLoginDto) {
    return this.authService.login(body);
  }

  @Post('signup')
  async signup(@Body() body: CreateUserDto) {
    return this.usersService.create(body);
  }
}
