import { IsArray, IsEnum, IsInt, IsOptional, ValidateNested } from "class-validator";
import { Status } from '../enums/status.enum';
import { CreateOrderItemDto } from '../../order-item/dto/create-order-item.dto';
import { Type } from 'class-transformer';

export class CreateOrderDto {
  @IsInt()
  @IsOptional()
  userId?: number;

  @IsEnum(Status)
  status: Status;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}
