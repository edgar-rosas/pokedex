import { Test, TestingModule } from '@nestjs/testing';
import { PokedexService } from './pokedex.service';
import { In, Repository } from 'typeorm';
import { createPokemon, Pokemon } from './entities/pokemon.entity';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { PokedexModule } from './pokedex.module';
import {
  mockedPokemonDetailsResponse,
  mockedPokemonListResponse,
} from './data/test.data';

describe('PokedexService', () => {
  let module: TestingModule;
  let service: PokedexService;
  let repository: Repository<Pokemon>;

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

    service = module.get(PokedexService);
    repository = module.get(getRepositoryToken(Pokemon));
  });

  beforeEach(async () => {
    const pokemonEntities = mockedPokemonDetailsResponse.map((p) =>
      createPokemon(p),
    );
    await repository.insert(pokemonEntities);
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
  describe('findAll', () => {
    it('returns pokemon', async () => {
      const [pokemon, count] = await service.findAll({ limit: 2, offset: 2 });

      expect(count).toBe(mockedPokemonDetailsResponse.length);
      expect(pokemon).toHaveLength(2);
    });
  });
});
