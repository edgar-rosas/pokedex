import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { createPokemon, Pokemon } from '../entities/pokemon.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PokemonListDto } from './dto/pokemon-list.dto';
import { PokemonDetailsDto } from './dto/pokemon-details.dto';

@Injectable()
export class PokedexSeederService {
  constructor(
    @InjectRepository(Pokemon)
    private pokemonRepository: Repository<Pokemon>,
  ) {}

  async fetchPokemonList(): Promise<void> {
    const POKE_API_URL = 'https://pokeapi.co/api/v2/pokemon/';
    try {
      const pokemonListResponse = await axios.get<PokemonListDto>(POKE_API_URL);

      const pokemonDetailsPromises = pokemonListResponse.data.results.map(
        (p) => {
          return axios.get<PokemonDetailsDto>(p.url);
        },
      );

      const pokemonDetailsResponses = await Promise.all(pokemonDetailsPromises);

      const pokemonEntities = pokemonDetailsResponses.map((res) =>
        createPokemon(res.data),
      );

      await this.pokemonRepository.insert(pokemonEntities);
    } catch (error) {
      console.error('Error occured during Pokedex seeding process', { error });
    }
  }
}
