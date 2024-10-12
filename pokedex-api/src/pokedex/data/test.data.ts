import { PokemonDetailsDto } from '../seeder/dto/pokemon-details.dto';
import { PokemonListDto } from '../seeder/dto/pokemon-list.dto';

export const mockedPokemonListResponse: PokemonListDto = {
  count: 5,
  next: null,
  previous: null,
  results: [
    {
      name: 'bulbasaur',
      url: 'https://pokeapi.co/api/v2/pokemon/1/',
    },
    {
      name: 'ivysaur',
      url: 'https://pokeapi.co/api/v2/pokemon/2/',
    },
    {
      name: 'venusaur',
      url: 'https://pokeapi.co/api/v2/pokemon/3/',
    },
    {
      name: 'charmander',
      url: 'https://pokeapi.co/api/v2/pokemon/4/',
    },
  ],
};

export const mockedPokemonDetailsResponse: PokemonDetailsDto[] =
  mockedPokemonListResponse.results.map((pokemon, index) => {
    return {
      id: index + 1400,
      name: pokemon.name,
      sprites: {
        front_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 1}.png`,
      },
    };
  });
