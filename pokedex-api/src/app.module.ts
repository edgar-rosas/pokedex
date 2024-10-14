import { Module } from '@nestjs/common';
import { PokedexModule } from './pokedex/pokedex.module';
import { ConfigModule } from '@nestjs/config';
import { validate } from './config.schema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate,
      isGlobal: true,
      cache: true,
    }),
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: process.env.DATABASE_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),
    PokedexModule,
    UserModule,
  ],
})
export class AppModule {}
