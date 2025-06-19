import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../prisma/prisma.service';
import { FilterProductDto } from './dto/filter-product.dto';
import { Prisma, Product } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(input: CreateProductDto): Promise<Product> {
    const existingProduct = await this.findAll({
      name: input.name,
    });

    if (existingProduct.length > 0)
      throw new BadRequestException(
        `product with name ${input.name} already exists`,
      );

    return this.prisma.product.create({
      data: {
        name: input.name,
        description: input.description,
        price: input.price,
        stock: input.stock,
      },
    });
  }

  async findAll(query: FilterProductDto): Promise<Product[]> {
    const where: any = {};
    if (query.name) {
      where.name = { contains: query.name, mode: 'insensitive' };
    }
    if (query.description) {
      where.description = { contains: query.description, mode: 'insensitive' };
    }
    if (query.price) {
      where.price = query.price;
    }
    if (query.stock) {
      where.type = query.stock;
    }

    return this.prisma.product.findMany({
      where,
      orderBy: { id: 'asc' },
      select: {
        id: true,
        name: true,
        description: true,
        stock: true,
        price: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findOne(id: number): Promise<Product | undefined> {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
      return undefined;
    }
    return product;
  }

  async update(
    id: number,
    input: UpdateProductDto,
    tx?: Prisma.TransactionClient,
  ): Promise<Product> {
    const product = await this.findOne(id);
    if (!product) {
      throw new NotFoundException(`product not found`);
    }

    if (input.name) {
      const existingProduct = await this.findAll({
        name: input.name,
      });

      if (existingProduct.length > 0 && existingProduct[0].id !== id) {
        throw new BadRequestException(
          `product with name ${input.name} already exists`,
        );
      }
      product.name = input.name;
    }
    if (input.description) {
      product.description = input.description;
    }
    if (input.price !== undefined) {
      product.price = input.price;
    }
    if (input.stock !== undefined) {
      product.stock = input.stock;
    }
    if (tx) {
      return tx.product.update({
        where: { id },
        data: {
          ...product,
        },
      });
    }
    return this.prisma.product.update({
      where: { id },
      data: {
        ...product,
      },
    });
  }

  async remove(id: number): Promise<Product> {
    const product = await this.findOne(id);
    if (!product) {
      throw new NotFoundException('product not found');
    }

    return this.prisma.product.delete({ where: { id } });
  }
}
