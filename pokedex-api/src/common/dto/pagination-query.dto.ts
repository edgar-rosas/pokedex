import { IsEnum, IsOptional, IsPositive } from 'class-validator';
import { OrderType } from '../enum/order-type.enum';

export class PaginationQueryDto {
  @IsOptional()
  @IsPositive()
  limit?: number;

  @IsOptional()
  @IsPositive()
  offset?: number;

  @IsOptional()
  @IsEnum(OrderType)
  order?: OrderType;
}
