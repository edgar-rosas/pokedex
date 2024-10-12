import { PartialType } from '@nestjs/mapped-types';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class FindAllPokemonQueryDto extends PartialType(PaginationQueryDto) {
  @IsOptional()
  @IsNotEmpty()
  name?: string;
}
