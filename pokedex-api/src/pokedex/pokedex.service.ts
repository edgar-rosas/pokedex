import { Injectable } from '@nestjs/common';
import { Pokemon } from './entities/pokemon.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { OrderType } from '../common/enum/order-type.enum';

@Injectable()
export class PokedexService {
  constructor(
    @InjectRepository(Pokemon)
    private pokemonRepository: Repository<Pokemon>,
  ) {}

  async findAll(pagination?: PaginationQueryDto) {
    return this.pokemonRepository.findAndCount({
      order: {
        id: pagination?.order || OrderType.ASC,
      },
      skip: pagination?.offset || null,
      take: pagination?.limit || null,
    });
  }
}
