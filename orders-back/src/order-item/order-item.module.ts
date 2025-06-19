import { Module } from '@nestjs/common';
import { OrderItemService } from './order-item.service';
import { PrismaModule } from '../prisma/prisma.module';
import { ProductsModule } from '../products/products.module';

@Module({
  controllers: [],
  providers: [OrderItemService],
  exports: [OrderItemService],
  imports: [PrismaModule, ProductsModule],
})
export class OrderItemModule {}
