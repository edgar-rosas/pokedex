import { Test, TestingModule } from '@nestjs/testing';
import { PokedexSeederService } from './pokedex-seeder.service';
import { AppModule } from '../../app.module';
import axios from 'axios';
import { PokemonListDto } from './dto/pokemon-list.dto';
import { In, Repository } from 'typeorm';
import { Pokemon } from '../entities/pokemon.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PokemonDetailsDto } from './dto/pokemon-details.dto';
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('PokedexSeederService', () => {
  let module: TestingModule;
  let service: PokedexSeederService;
  let repository: Repository<Pokemon>;

  const mockedPokemonListResponse: PokemonListDto = {
    count: 5,
    next: 'next',
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

  const mockedPokemonDetailsResponse: PokemonDetailsDto[] =
    mockedPokemonListResponse.results.map((pokemon, index) => {
      return {
        id: index + 1,
        name: pokemon.name,
        sprites: {
          front_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 1}.png`,
        },
      };
    });

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    service = module.get(PokedexSeederService);
    repository = module.get(getRepositoryToken(Pokemon));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await repository.delete({
      name: In(mockedPokemonListResponse.results.map((p) => p.name)),
    });
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('fetchPokemonList', () => {
    it('should fetch pokemon', async () => {
      mockedAxios.get.mockResolvedValueOnce({
        data: mockedPokemonListResponse,
      });
      mockedPokemonDetailsResponse.forEach((mockedRes) => {
        mockedAxios.get.mockResolvedValueOnce({
          data: mockedRes,
        });
      });

      await service.fetchPokemonList();
    });
  });
});
