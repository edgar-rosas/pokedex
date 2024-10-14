import { ApiProperty } from '@nestjs/swagger';
import { Pokemon } from '../entities/pokemon.entity';
import { mockedPokemonListResponse } from '../data/test.data';

export class FindAllPokemonResponseDto {
  constructor(pokemon: Pokemon[], count: number) {
    this.count = count;
    this.pokemon = pokemon.map((p) => new PokemonDto(p));
  }
  @ApiProperty({
    description: 'List of pokemon',
    example: mockedPokemonListResponse.results.map((pokemon, index) => {
      return {
        id: index + 1400,
        name: pokemon.name,
        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 1}.png`,
      };
    }),
  })
  pokemon: PokemonDto[];

  @ApiProperty({
    description: 'Total count of Pokemon found according to search filters.',
  })
  count: number;
}

export class PokemonDto {
  constructor(pokemon: Pokemon) {
    this.id = pokemon.id;
    this.name = pokemon.name;
    this.image = pokemon.image;
  }
  @ApiProperty({
    description: 'Pokemon ID',
  })
  id: number;

  @ApiProperty({
    description: 'Pokemon name',
  })
  name: string;

  @ApiProperty({
    description: 'Pokemon sprite image URL',
  })
  image: string;
}
