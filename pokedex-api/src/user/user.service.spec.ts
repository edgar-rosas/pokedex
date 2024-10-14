import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { In, Repository } from 'typeorm';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user.module';
import { CreateUserDto } from './dto/create-user.dto';
import { createUserTestData } from './data/test.data';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { createPokemon, Pokemon } from '../pokedex/entities/pokemon.entity';
import {
  mockedPokemonDetailsResponse,
  mockedPokemonListResponse,
} from '../pokedex/data/test.data';

describe('UserService', () => {
  let module: TestingModule;
  let service: UserService;
  let repository: Repository<User>;
  let pokemonRepository: Repository<Pokemon>;
  let userTestData: CreateUserDto[];

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'better-sqlite3',
          database: 'sqlite-pokedex-testing.sqlite3',
          autoLoadEntities: true,
          synchronize: true,
        }),
        UserModule,
      ],
    }).compile();

    service = module.get(UserService);
    repository = module.get(getRepositoryToken(User));
    pokemonRepository = module.get(getRepositoryToken(Pokemon));

    userTestData = createUserTestData();
  });

  afterEach(async () => {
    await repository.delete({
      name: In(userTestData.map((u) => u.name)),
    });
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('creates a new user', async () => {
      const newUser = await service.createUser(userTestData[0]);

      expect(newUser).toBeTruthy();
      expect(newUser).toBeInstanceOf(User);

      expect(newUser.name).toBe(userTestData[0].name);
    });

    it('throws conflict exception when name is not unique', async () => {
      await service.createUser(userTestData[0]);

      expect(async () => {
        await service.createUser(userTestData[0]);
      }).rejects.toThrow(ConflictException);
    });
  });

  describe('mark and unmark Pokemon as favorite', () => {
    let user: User;
    beforeAll(async () => {
      const pokemonEntities = mockedPokemonDetailsResponse.map((p) =>
        createPokemon(p),
      );
      await pokemonRepository.insert(pokemonEntities);
      user = await service.createUser({ name: 'user-favorite' });
    });

    afterAll(async () => {
      await pokemonRepository.delete({
        name: In(mockedPokemonListResponse.results.map((p) => p.name)),
      });

      await repository.delete({
        id: user.id,
      });
      jest.clearAllMocks();
    });

    it('marks and unmarks pokemon as favorite by the user', async () => {
      await service.markPokemonAsFavorite({
        userId: user.id,
        pokemonId: 1400,
      });

      const userWithFavorites = await repository.findOne({
        where: {
          id: user.id,
        },
        relations: {
          favoritePokemon: true,
        },
      });

      expect(userWithFavorites.favoritePokemon).toHaveLength(1);
      expect(userWithFavorites.favoritePokemon).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: 1400,
          }),
        ]),
      );

      await service.removePokemonAsFavorite({
        userId: user.id,
        pokemonId: 1400,
      });

      const userWithoutFavorites = await repository.findOne({
        where: {
          id: user.id,
        },
        relations: {
          favoritePokemon: true,
        },
      });

      expect(userWithoutFavorites.favoritePokemon).toHaveLength(0);
    });

    it('throws conflict exception when Pokemon is already a favorite', async () => {
      await service.markPokemonAsFavorite({
        userId: user.id,
        pokemonId: 1400,
      });

      const userWithFavorites = await repository.findOne({
        where: {
          id: user.id,
        },
        relations: {
          favoritePokemon: true,
        },
      });

      expect(userWithFavorites.favoritePokemon).toHaveLength(1);
      expect(userWithFavorites.favoritePokemon).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: 1400,
          }),
        ]),
      );

      expect(async () => {
        await service.markPokemonAsFavorite({
          userId: user.id,
          pokemonId: 1400,
        });
      }).rejects.toThrow(ConflictException);
    });

    it('handles removing a non existing relationship', async () => {
      await service.removePokemonAsFavorite({
        userId: user.id,
        pokemonId: 1400,
      });

      const userWithoutFavorites = await repository.findOne({
        where: {
          id: user.id,
        },
        relations: {
          favoritePokemon: true,
        },
      });

      expect(userWithoutFavorites.favoritePokemon).toHaveLength(0);
    });

    it('throws NotFound exception when either target is not found', async () => {
      expect(async () => {
        await service.markPokemonAsFavorite({
          userId: 9875,
          pokemonId: 1400,
        });
      }).rejects.toThrow(NotFoundException);

      expect(async () => {
        await service.removePokemonAsFavorite({
          userId: user.id,
          pokemonId: 5,
        });
      }).rejects.toThrow(NotFoundException);
    });
  });
});
