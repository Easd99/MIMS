import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { Status } from '../enums/status.enum';

export class ChangeStatusOrderDto {
  @IsEnum(Status)
  status: Status;
}
