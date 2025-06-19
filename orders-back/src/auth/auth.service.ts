import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthLoginDto } from './dto/auth-login.dto';
import { ClientProxy } from '@nestjs/microservices';
import { ResponseUserDto } from '../users/dto/response-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @Inject('USERS_SERVICE') private client: ClientProxy,
  ) {}

  async validateUser(email: string, pass: string) {
    const userPromise = this.client.send<ResponseUserDto>(
      'user.byEmail',
      email,
    );
    const user = await userPromise[0];
    if (!user) {
      throw new UnauthorizedException('invalid credentials');
    }

    const validatePasswordPromise = this.client.send<boolean>(
      'user.validatePassword',
      { pass: pass, hashed: user.password },
    );

    if (user && (await validatePasswordPromise)) {
      const { ...result } = user;
      return result;
    }
    return null;
  }

  async login(body: AuthLoginDto) {
    const user = await this.validateUser(body.email, body.password);

    if (!user) throw new UnauthorizedException('invalid credentials');
    const payload = {
      name: user.name,
      email: user.email,
      sub: user.id,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
