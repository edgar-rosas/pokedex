import { Injectable } from '@nestjs/common';
import { Pokemon } from './entities/pokemon.entity';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderType } from '../common/enum/order-type.enum';
import { FindAllPokemonQueryDto } from './dto/find-all-pokemon-query.dto';

@Injectable()
export class PokedexService {
  constructor(
    @InjectRepository(Pokemon)
    private pokemonRepository: Repository<Pokemon>,
  ) {}

  async findAll(params?: FindAllPokemonQueryDto) {
    return this.pokemonRepository.findAndCount({
      where: params?.name
        ? {
            name: Like(`%${params.name}%`),
          }
        : undefined,
      order: {
        id: params?.order || OrderType.ASC,
      },
      skip: params?.offset || 0,
      take: params?.limit || 20,
    });
  }

  async findById(id: number) {
    return this.pokemonRepository.findOne({
      where: {
        id,
      },
    });
  }
}
