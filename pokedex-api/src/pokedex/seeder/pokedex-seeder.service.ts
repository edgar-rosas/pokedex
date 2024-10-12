import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { createPokemon, Pokemon } from '../entities/pokemon.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PokemonListDto } from './dto/pokemon-list.dto';
import { PokemonDetailsDto } from './dto/pokemon-details.dto';

type BatchReport = {
  insertCount: number;
  url: string;
  next?: string;
};

@Injectable()
export class PokedexSeederService {
  constructor(
    @InjectRepository(Pokemon)
    private pokemonRepository: Repository<Pokemon>,
  ) {}

  async seed(): Promise<void> {
    const localPokemonCount = await this.pokemonRepository.count();
    if (localPokemonCount === 0) {
      console.log(
        `Found ${localPokemonCount} Pokemon in local DB, starting seed process...`,
      );
      await this.fetchPokemonList();
      console.log('Seeding process complete');
    } else {
      console.log(`Found ${localPokemonCount} Pokemon in local DB`);
    }
  }

  async fetchPokemonList(): Promise<BatchReport[]> {
    let pokeApiUrl = 'https://pokeapi.co/api/v2/pokemon/';
    const reports: BatchReport[] = [];
    try {
      while (pokeApiUrl !== null) {
        const report = await this.processBatch(pokeApiUrl);
        reports.push(report);
        pokeApiUrl = report.next;
      }
      return reports;
    } catch (error) {
      console.error('Error occured during Pokedex seeding process', {
        error,
        lastReport: reports.length > 0 ? reports[reports.length - 1] : null,
      });
      return [];
    }
  }

  private async processBatch(url: string): Promise<BatchReport> {
    const pokemonListResponse = await axios.get<PokemonListDto>(url);

    const pokemonDetailsPromises = pokemonListResponse.data.results.map((p) => {
      return axios.get<PokemonDetailsDto>(p.url);
    });

    const pokemonDetailsResponses = await Promise.all(pokemonDetailsPromises);

    const pokemonEntities = pokemonDetailsResponses.map((res) =>
      createPokemon(res.data),
    );
    const result = await this.pokemonRepository.insert(pokemonEntities);

    return {
      url,
      next: pokemonListResponse.data.next,
      insertCount: result.identifiers.length,
    };
  }
}
