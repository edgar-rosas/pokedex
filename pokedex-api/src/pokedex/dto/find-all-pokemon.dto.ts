import { PartialType } from '@nestjs/mapped-types';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class FindAllPokemonDto extends PartialType(PaginationQueryDto) {
  @IsOptional()
  @IsNotEmpty()
  name?: string;
}
