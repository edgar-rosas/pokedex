import { Column, Entity, PrimaryColumn, Unique } from 'typeorm';
import { PokemonDetailsDto } from '../seeder/dto/pokemon-details.dto';

@Entity()
@Unique('pokemon_name_uq', ['name'])
export class Pokemon {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  image: string;
}

export function createPokemon(pokemonDto: PokemonDetailsDto): Pokemon {
  const pokemon = new Pokemon();
  pokemon.id = pokemonDto.id;
  pokemon.name = pokemonDto.name;
  pokemon.image =
    pokemonDto.sprites?.front_default || 'https://i.ibb.co/Y0Lkc9Z/Poke404.jpg';
  return pokemon;
}
