import { Pokemon } from './../../pokedex/entities/pokemon.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique('user_name_uq', ['name'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @JoinTable({
    name: 'user_favorite_pokemon',
  })
  @ManyToMany(() => Pokemon, {
    cascade: true,
  })
  favoritePokemon: Pokemon[];
}

export function createUser(name: string): User {
  const user = new User();
  user.name = name;
  return user;
}
