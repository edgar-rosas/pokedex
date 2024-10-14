import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pokemon } from './entities/pokemon.entity';
import { PokedexSeederService } from './seeder/pokedex-seeder.service';
import { PokedexService } from './pokedex.service';
import { PokedexController } from './pokedex.controller';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pokemon, User])],
  providers: [PokedexSeederService, PokedexService],
  controllers: [PokedexController],
  exports: [PokedexService],
})
export class PokedexModule implements OnApplicationBootstrap {
  constructor(private readonly pokedexSeeder: PokedexSeederService) {}
  async onApplicationBootstrap(): Promise<void> {
    await this.pokedexSeeder.seed();
  }
}
