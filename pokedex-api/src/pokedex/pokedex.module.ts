import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pokemon } from './entities/pokemon.entity';
import { PokedexSeederService } from './seeder/pokedex-seeder.service';
import { PokedexService } from './pokedex.service';

@Module({
  imports: [TypeOrmModule.forFeature([Pokemon])],
  providers: [PokedexSeederService, PokedexService],
})
export class PokedexModule implements OnApplicationBootstrap {
  constructor(private readonly pokedexSeeder: PokedexSeederService) {}
  async onApplicationBootstrap(): Promise<void> {
    await this.pokedexSeeder.seed();
  }
}
