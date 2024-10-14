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
      const { pokemon, count } = await service.findAll({ limit: 2, offset: 2 });

      expect(count).toBe(mockedPokemonDetailsResponse.length);
      expect(pokemon).toHaveLength(2);
    });

    it('returns pokemon by name', async () => {
      const { pokemon, count } = await service.findAll({ name: 'bulbasaur' });

      expect(count).toBe(1);
      expect(pokemon).toHaveLength(1);
    });

    it('returns empty array', async () => {
      const { pokemon, count } = await service.findAll({ name: 'not found' });

      expect(count).toBe(0);
      expect(pokemon).toHaveLength(0);
    });
  });

  describe('findByID', () => {
    it('returns pokemon found by ID', async () => {
      const foundPokemon = await service.findById(1400);

      expect(foundPokemon).toBeTruthy();
      expect(foundPokemon).toBeInstanceOf(Pokemon);

      expect(foundPokemon.id).toBe(1400);
    });

    it('returns null if nothing is found', async () => {
      const pokemon = await service.findById(0);

      expect(pokemon).toBeNull();
    });
  });
});
