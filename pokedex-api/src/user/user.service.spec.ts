import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { In, Repository } from 'typeorm';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user.module';
import { CreateUserDto } from './dto/create-user-dto';
import { createUserTestData } from './data/test.data';
import { ConflictException } from '@nestjs/common';

describe('UserService', () => {
  let module: TestingModule;
  let service: UserService;
  let repository: Repository<User>;
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
});
