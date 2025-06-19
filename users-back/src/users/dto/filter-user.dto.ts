import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class FilterUserDto {
  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsBoolean()
  showPassword?: boolean;
}
