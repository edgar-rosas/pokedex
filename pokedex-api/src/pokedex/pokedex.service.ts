import { Injectable } from '@nestjs/common';
import { Pokemon } from './entities/pokemon.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderType } from '../common/enum/order-type.enum';
import { FindAllPokemonQueryDto } from './dto/find-all-pokemon-query.dto';
import { User } from '../user/entities/user.entity';

export type FindAllPokemonWithUserFavorites = {
  pokemon: Pokemon[];
  count: number;
  favoriteIds?: number[];
};

@Injectable()
export class PokedexService {
  constructor(
    @InjectRepository(Pokemon)
    private pokemonRepository: Repository<Pokemon>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(
    params?: FindAllPokemonQueryDto,
    userId?: number,
  ): Promise<FindAllPokemonWithUserFavorites> {
    const query = this.pokemonRepository.createQueryBuilder();

    if (params.name) {
      query.andWhere('name LIKE :name', { name: `%${params.name}%` });
    }

    query
      .addOrderBy('id', params?.order || OrderType.ASC)
      .skip(params?.offset || 0)
      .take(params?.limit || 20);

    let userWithFavorites: User;

    if (userId) {
      userWithFavorites = await this.userRepository.findOne({
        where: {
          id: userId,
        },
        loadRelationIds: {
          relations: ['favoritePokemon'],
        },
      });
    }

    const [pokemon, count] = await query.getManyAndCount();

    return {
      pokemon,
      count,
      favoriteIds: <number[]>(<unknown>userWithFavorites?.favoritePokemon),
    };
  }

  async findById(id: number) {
    return this.pokemonRepository.findOne({
      where: {
        id,
      },
    });
  }
}
