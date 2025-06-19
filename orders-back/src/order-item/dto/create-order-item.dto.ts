import { IsInt, IsOptional, IsPositive } from 'class-validator';

export class CreateOrderItemDto {
  @IsInt()
  productId: number;

  @IsInt()
  @IsPositive()
  quantity: number;

  @IsInt()
  @IsOptional()
  orderId?: number;
}
