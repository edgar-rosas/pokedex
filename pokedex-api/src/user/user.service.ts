import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createUser, User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { queryFailedGuard } from '../common/errors/guards';
import {
  SQLITE_PRIMARY_CONSTRAINT_ERROR_CODE,
  SQLITE_UNIQUE_CONSTRAINT_ERROR_CODE,
} from '../common/constants';
import { PokedexService } from '../pokedex/pokedex.service';

export type FavoritePokemonParams = {
  pokemonId: number;
  userId: number;
};

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly pokedexService: PokedexService,
  ) {}

  async createUser(params: CreateUserDto) {
    try {
      const user = await this.userRepository.save(createUser(params.name));
      return user;
    } catch (error) {
      if (
        queryFailedGuard(error) &&
        error.code === SQLITE_UNIQUE_CONSTRAINT_ERROR_CODE
      ) {
        throw new ConflictException();
      }

      throw error;
    }
  }

  async markPokemonAsFavorite(params: FavoritePokemonParams) {
    const { targetUser, targetPokemon } =
      await this.retrieveTargetEntities(params);

    try {
      await this.userRepository
        .createQueryBuilder()
        .relation(User, 'favoritePokemon')
        .of(targetUser)
        .add(targetPokemon);
    } catch (error) {
      if (
        queryFailedGuard(error) &&
        error.code === SQLITE_PRIMARY_CONSTRAINT_ERROR_CODE
      ) {
        throw new ConflictException();
      }
    }
  }

  async removePokemonAsFavorite(params: FavoritePokemonParams) {
    const { targetUser, targetPokemon } =
      await this.retrieveTargetEntities(params);

    await this.userRepository
      .createQueryBuilder()
      .relation(User, 'favoritePokemon')
      .of(targetUser)
      .remove(targetPokemon);
  }

  private async retrieveTargetEntities(params: FavoritePokemonParams) {
    const targetPokemon = await this.pokedexService.findById(params.pokemonId);

    if (!targetPokemon) {
      throw new NotFoundException();
    }

    const targetUser = await this.userRepository.findOne({
      where: {
        id: params.userId,
      },
    });

    if (!targetUser) {
      throw new NotFoundException();
    }
    return { targetUser, targetPokemon };
  }
}
