import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { ResponseUserDto } from '../users/dto/response-user.dto';
import { Order, OrderItem } from '../../generated/prisma';
import { OrderItemService } from '../order-item/order-item.service';
import { PrismaService } from '../prisma/prisma.service';
import { FilterOrderDto } from './dto/filter-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @Inject('USERS_SERVICE') private client: ClientProxy,
    private prisma: PrismaService,
    private readonly orderItemService: OrderItemService,
  ) {}

  async validateUser(userId: number): Promise<ResponseUserDto> {
    const userPromise = this.client.send<ResponseUserDto>(
      'user.exists',
      userId,
    );
    return await lastValueFrom(userPromise);
  }

  async create(input: CreateOrderDto): Promise<Order> {
    return this.prisma.$transaction(async (tx) => {
      // Validar que el usuario existe
      const user = await this.validateUser(input.userId);
      if (!user) {
        throw new NotFoundException('user not found');
      }

      const order = await tx.order.create({
        data: {
          userId: input.userId,
          status: input.status,
        },
        include: {
          items: true,
        },
      });

      const items: OrderItem[] = [];
      if (input.items) {
        for (const item of input.items) {
          const orderItem = await this.orderItemService.create(
            {
              productId: item.productId,
              quantity: item.quantity,
              orderId: order.id,
            },
            tx,
          );
          items.push(orderItem);
        }
      }

      order.items = items;
      return order;
    });
  }

  async findAll(filters: FilterOrderDto): Promise<Order[]> {
    const where: any = {};

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.userId) {
      where.userId = filters.userId;
    }

    if (filters.date) {
      const start = new Date(filters.date + 'T00:00:00');
      const end = new Date(filters.date + 'T23:59:59');
      where.createdAt = {
        gte: start,
        lte: end,
      };
    }

    if (filters.fromDate) {
      where.createdAt = {
        ...(where.createdAt || {}),
        gte: new Date(filters.fromDate + 'T00:00:00'),
      };
    }

    if (filters.toDate) {
      where.createdAt = {
        ...(where.createdAt || {}),
        lte: new Date(filters.toDate + 'T23:59:59'),
      };
    }

    return this.prisma.order.findMany({
      where,
      orderBy: { id: 'asc' },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async findOne(id: number, userId: number): Promise<Order | undefined> {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });
    if (order && order.userId !== userId) {
      throw new NotFoundException('you are not the owner of this order');
    }
    if (!order) {
      return undefined;
    }
    return order;
  }

  async update(id: number, input: UpdateOrderDto): Promise<Order> {
    const order = await this.findOne(id, input.userId);
    if (!order) {
      throw new NotFoundException('order not found');
    }
    return this.prisma.$transaction(async (tx) => {
      const data = {};
      if (input.status) {
        data['status'] = input.status;
      }

      const order = await tx.order.update({
        where: { id },
        data: {
          ...data,
        },
        include: {
          items: true,
        },
      });

      const items: OrderItem[] = [];
      if (input.items) {
        await tx.orderItem.deleteMany({
          where: { orderId: id },
        });

        for (const item of input.items) {
          const orderItem = await this.orderItemService.create(
            {
              productId: item.productId,
              quantity: item.quantity,
              orderId: id,
            },
            tx,
          );
          items.push(orderItem);
        }
        order.items = items;
      }

      return order;
    });
  }

  async remove(id: number, userId: number): Promise<Order> {
    const order = await this.findOne(id, userId);
    if (!order) {
      throw new NotFoundException('order not found');
    }
    return this.prisma.order.delete({
      where: { id },
      include: { items: true },
    });
  }
}
