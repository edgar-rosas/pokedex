import { Test, TestingModule } from '@nestjs/testing';
import { PokedexSeederService } from './pokedex-seeder.service';
import axios from 'axios';
import { PokemonListDto } from './dto/pokemon-list.dto';
import { In, Repository } from 'typeorm';
import { Pokemon } from '../entities/pokemon.entity';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { PokemonDetailsDto } from './dto/pokemon-details.dto';
import { PokedexModule } from '../pokedex.module';
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('PokedexSeederService', () => {
  let module: TestingModule;
  let service: PokedexSeederService;
  let repository: Repository<Pokemon>;

  const mockedPokemonListResponse: PokemonListDto = {
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
      imports: [
        TypeOrmModule.forRoot({
          type: 'better-sqlite3',
          database: 'sqlite-pokedex-testing.sqlite3',
          autoLoadEntities: true,
          synchronize: true,
        }),
        PokedexModule,
      ],
    }).compile();

    service = module.get(PokedexSeederService);
    repository = module.get(getRepositoryToken(Pokemon));
  });

  afterEach(async () => {
    await repository.delete({
      name: In(mockedPokemonListResponse.results.map((p) => p.name)),
    });
    jest.clearAllMocks();
  });

  afterAll(async () => {
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

      const reports = await service.fetchPokemonList();
      expect(reports).toHaveLength(1);
      expect(reports).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            insertCount: 4,
          }),
        ]),
      );
    });

    it('should stop fetching when next url is null', async () => {
      function delay(t: number, val: unknown) {
        return new Promise(function (resolve) {
          setTimeout(function () {
            resolve(val);
          }, t);
        });
      }

      for (let i = 0; i < mockedPokemonListResponse.results.length - 1; i++) {
        mockedAxios.get.mockImplementationOnce(() => {
          return delay(500, {
            data: {
              ...mockedPokemonListResponse,
              next: 'url' + i,
              results: [mockedPokemonListResponse.results[i]],
            },
          });
        });
        mockedAxios.get.mockImplementationOnce(() => {
          return delay(500, {
            data: mockedPokemonDetailsResponse[i],
          });
        });
      }

      mockedAxios.get.mockResolvedValueOnce({
        data: {
          ...mockedPokemonListResponse,
          next: null,
          results: [
            mockedPokemonListResponse.results[
              mockedPokemonListResponse.results.length - 1
            ],
          ],
        },
      });

      mockedAxios.get.mockResolvedValueOnce({
        data: mockedPokemonDetailsResponse[
          mockedPokemonListResponse.results.length - 1
        ],
      });

      const reports = await service.fetchPokemonList();

      expect(reports).toHaveLength(4);
      expect(reports).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            insertCount: 1,
          }),
          expect.objectContaining({
            insertCount: 1,
          }),
          expect.objectContaining({
            insertCount: 1,
          }),
          expect.objectContaining({
            insertCount: 1,
          }),
        ]),
      );

      const [pokemon, count] = await repository.findAndCount();
      expect(count).toEqual(4);

      expect(pokemon).toEqual(
        expect.arrayContaining(
          mockedPokemonListResponse.results.map((p) =>
            expect.objectContaining({ name: p.name }),
          ),
        ),
      );
    });
  });

  describe('seed', () => {
    it('starts seeding process when local count is 0', async () => {
      const fetchPokemonListSpy = jest.spyOn(service, 'fetchPokemonList');

      mockedAxios.get.mockResolvedValueOnce({
        data: mockedPokemonListResponse,
      });

      mockedPokemonDetailsResponse.forEach((mockedRes) => {
        mockedAxios.get.mockResolvedValueOnce({
          data: mockedRes,
        });
      });
      await service.seed();

      expect(fetchPokemonListSpy).toHaveBeenCalled();
      fetchPokemonListSpy.mockRestore();
    });
  });
});
