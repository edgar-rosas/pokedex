import { ApiProperty } from '@nestjs/swagger';
import { Pokemon } from '../entities/pokemon.entity';
import { mockedPokemonListResponse } from '../data/test.data';
import { FindAllPokemonWithUserFavorites } from '../pokedex.service';

export class FindAllPokemonResponseDto {
  constructor(data: FindAllPokemonWithUserFavorites) {
    this.count = data.count;
    this.pokemon = data.pokemon.map(
      (p) => new PokemonDto(p, data.favoriteIds?.includes(p.id)),
    );
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
  constructor(pokemon: Pokemon, isFavorite: boolean) {
    this.id = pokemon.id;
    this.name = pokemon.name;
    this.image = pokemon.image;
    this.isFavorite = isFavorite;
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

  @ApiProperty({
    description:
      'Indicates if this Pokemon has been marked as favorite by current user',
  })
  isFavorite: boolean;
}
