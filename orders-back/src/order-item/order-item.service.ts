import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ProductsService } from '../products/products.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class OrderItemService {
  constructor(
    private prisma: PrismaService,
    private readonly productsService: ProductsService,
  ) {}

  async create(input: CreateOrderItemDto, tx: Prisma.TransactionClient) {
    const product = await this.productsService.findOne(input.productId);

    if (!product) throw new NotFoundException('product not found');

    if (input.quantity == 0) {
      throw new BadRequestException('product not available');
    }

    if (product.stock !== -1 && product.stock < input.quantity) {
      throw new BadRequestException('not enough stock');
    }

    const orderItem = await tx.orderItem.create({
      data: {
        productId: input.productId,
        quantity: input.quantity,
        price: product.price,
        orderId: input.orderId,
      },
    });

    if (product.stock !== -1) {
      await this.productsService.update(
        product.id,
        {
          stock: product.stock - input.quantity,
        },
        tx,
      );
    }

    return orderItem;
  }

  async update(input: UpdateOrderItemDto) {
    const { orderId, productId, quantity } = input;

    const existingItem = await this.prisma.orderItem.findUnique({
      where: {
        orderId_productId: {
          orderId,
          productId,
        },
      },
    });

    if (!existingItem) {
      throw new NotFoundException('order item not found');
    }

    const product = await this.productsService.findOne(productId);
    if (!product) {
      throw new NotFoundException('product not found');
    }

    if (quantity === 0) {
      throw new BadRequestException('product not available');
    }

    const quantityDiff = quantity - existingItem.quantity;

    if (product.stock !== -1 && product.stock < quantityDiff) {
      throw new BadRequestException('not enough stock');
    }

    const updated = await this.prisma.orderItem.update({
      where: {
        orderId_productId: {
          orderId,
          productId,
        },
      },
      data: {
        quantity,
        price: product.price,
      },
    });

    if (product.stock !== -1 && quantityDiff !== 0) {
      await this.productsService.update(product.id, {
        stock: product.stock - quantityDiff,
      });
    }

    return updated;
  }
}
