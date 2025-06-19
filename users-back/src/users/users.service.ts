import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

    const existingUser = await this.prisma.user.findUnique({
      where: { email: input.email },
    });
    if (existingUser) {
      throw new ConflictException('email already exists');
    }

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
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        password: false,
        createdAt: true,
      },
    });
  }

  async update(id: number, data: UpdateUserDto): Promise<ResponseUserDto> {
    const existingUser = await this.findOne(id);
    if (!existingUser) {
      throw new NotFoundException('user not found');
    }
    if (data.email) {
      const existingUser = await this.findAll({
        email: data.email,
      })[0];
      if (existingUser && existingUser.id !== id) {
        throw new ConflictException('email already exists');
      }
    }
    if (data.password) {
      data.password = await this.hashPassword(data.password);
    }

    return this.prisma.user.update({
      where: { id },
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

  async remove(id: number): Promise<ResponseUserDto> {
    const existingUser = await this.findOne(id);
    if (!existingUser) {
      throw new NotFoundException('user not found');
    }
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
