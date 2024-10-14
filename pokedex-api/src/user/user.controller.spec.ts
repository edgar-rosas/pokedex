import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { In, Repository } from 'typeorm';
import { UserModule } from './user.module';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { createUserTestData } from './data/test.data';
import { ConflictException } from '@nestjs/common';

describe('UserController', () => {
  let controller: UserController;
  let module: TestingModule;
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

    controller = module.get<UserController>(UserController);
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
    expect(controller).toBeDefined();
  });

  describe('createUser', () => {
    it('creates a new user', async () => {
      const res = await controller.createUser(userTestData[0]);

      expect(res).toBeTruthy();
      expect(res.user.name).toBe(userTestData[0].name);
    });

    it('throws conflict exception when name is not unique', async () => {
      await controller.createUser(userTestData[0]);

      expect(async () => {
        await controller.createUser(userTestData[0]);
      }).rejects.toThrow(ConflictException);
    });
  });
});
