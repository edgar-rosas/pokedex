import { ApiProperty } from '@nestjs/swagger';
import { IsPositive } from 'class-validator';

export class MarkAsFavoriteDto {
  @ApiProperty({
    description: 'Pokemon ID to be marked as favorite',
  })
  @IsPositive()
  readonly pokemonId: number;
}
