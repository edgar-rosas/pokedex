import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { Pokemon } from '../pokedex/entities/pokemon.entity';
import { UserController } from './user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Pokemon])],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
