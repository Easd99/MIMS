import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PrismaModule } from '../prisma/prisma.module';
import { OrderItemModule } from '../order-item/order-item.module';
import * as process from 'node:process';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
  imports: [
    ClientsModule.register([
      {
        name: 'USERS_SERVICE',
        transport: Transport.NATS,
        options: {
          servers: [`${process.env.NATS_URL}`],
        },
      },
    ]),
    PrismaModule,
    OrderItemModule,
  ],
})
export class OrdersModule {}
