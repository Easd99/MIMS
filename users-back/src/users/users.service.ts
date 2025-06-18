import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '../../generated/prisma';
import { FilterUserDto } from './dto/filter-user.dto';
import { ResponseUserDto } from './dto/response-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(
    input: Omit<User, 'id' | 'createdAt'>,
  ): Promise<ResponseUserDto> {
    const hashedPassword = await this.hashPassword(input.password);

    const data: Omit<User, 'id' | 'createdAt'> = {
      ...input,
      password: hashedPassword,
    };

    return this.prisma.user.create({
      data,
      select: {
        id: true,
        name: true,
        email: true,
        password: false,
        createdAt: true,
      },
    });
  }

  async findAll(query: FilterUserDto): Promise<ResponseUserDto[]> {
    const where: any = {};
    if (query.email) {
      where.email = { contains: query.email, mode: 'insensitive' };
    }

    return this.prisma.user.findMany({
      where,
      orderBy: { id: 'asc' },
      select: {
        id: true,
        name: true,
        email: true,
        password: query.showPassword,
        createdAt: true,
      },
    });
  }

  async findOne(id: number): Promise<ResponseUserDto | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async update(id: number, data: Partial<User>): Promise<ResponseUserDto> {
    return this.prisma.user.update({ where: { id }, data });
  }

  async remove(id: number): Promise<ResponseUserDto> {
    return this.prisma.user.delete({ where: { id } });
  }

  async hashPassword(password: string): Promise<string> {
    const saltOrRounds = 10;
    return await bcrypt.hash(password, saltOrRounds);
  }

  async validatePassword(plainText: string, hashed: string) {
    return bcrypt.compare(plainText, hashed);
  }
}
