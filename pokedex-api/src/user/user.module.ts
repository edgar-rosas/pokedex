import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { Pokemon } from '../pokedex/entities/pokemon.entity';
import { UserController } from './user.controller';
import { PokedexModule } from '../pokedex/pokedex.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Pokemon]), PokedexModule],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
