import { Column, Entity, ManyToMany, PrimaryColumn, Unique } from 'typeorm';
import { PokemonDetailsDto } from '../seeder/dto/pokemon-details.dto';
import { User } from '../../user/entities/user.entity';

@Entity()
@Unique('pokemon_name_uq', ['name'])
export class Pokemon {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  image: string;

  @ManyToMany(() => User, (user) => user.favoritePokemon)
  markedAsFavoriteBy: User[];
}

export function createPokemon(pokemonDto: PokemonDetailsDto): Pokemon {
  const pokemon = new Pokemon();
  pokemon.id = pokemonDto.id;
  pokemon.name = pokemonDto.name;
  pokemon.image =
    pokemonDto.sprites?.front_default || 'https://i.ibb.co/Y0Lkc9Z/Poke404.jpg';
  return pokemon;
}
