import { IsOptional, IsString, IsNumber, IsEnum } from 'class-validator';

export class FilterOrderDto {
  @IsOptional()
  @IsString()
  date?: string; // formato: YYYY-MM-DD

  @IsOptional()
  @IsString()
  @IsEnum(['pending', 'completed', 'cancelled'])
  status?: string;

  @IsOptional()
  @IsNumber()
  userId?: number;

  @IsOptional()
  @IsString()
  fromDate?: string;

  @IsOptional()
  @IsString()
  toDate?: string;
}
