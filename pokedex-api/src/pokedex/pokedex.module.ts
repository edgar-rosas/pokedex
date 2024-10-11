import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pokemon } from './entities/pokemon.entity';
import { PokedexSeederService } from './seeder/pokedex-seeder.service';

@Module({
  imports: [TypeOrmModule.forFeature([Pokemon])],
  providers: [PokedexSeederService],
})
export class PokedexModule {}
