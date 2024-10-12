import { Injectable } from '@nestjs/common';
import { Pokemon } from './entities/pokemon.entity';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderType } from '../common/enum/order-type.enum';
import { FindAllPokemonDto } from './dto/find-all-pokemon.dto';

@Injectable()
export class PokedexService {
  constructor(
    @InjectRepository(Pokemon)
    private pokemonRepository: Repository<Pokemon>,
  ) {}

  async findAll(params?: FindAllPokemonDto) {
    return this.pokemonRepository.findAndCount({
      where: params?.name
        ? {
            name: Like(`%${params.name}%`),
          }
        : undefined,
      order: {
        id: params?.order || OrderType.ASC,
      },
      skip: params?.offset || null,
      take: params?.limit || null,
    });
  }
}
