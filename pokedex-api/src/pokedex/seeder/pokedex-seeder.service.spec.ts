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
    ],
  };

  const mockedPokemonDetailsResponse: PokemonDetailsDto = {
    id: 1,
    name: 'bulbasaur',
    sprites: {
      front_default:
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
    },
  };

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
      id: In([mockedPokemonDetailsResponse.id]),
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
      mockedAxios.get.mockResolvedValueOnce({
        data: mockedPokemonDetailsResponse,
      });
      await service.fetchPokemonList();
    });
  });
});
