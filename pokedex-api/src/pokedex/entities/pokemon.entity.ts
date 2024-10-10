import { Column, Entity, PrimaryColumn, Unique } from 'typeorm';

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
