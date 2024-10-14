import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { UserResponseDto } from './dto/user-response.dto';
import { MarkAsFavoriteDto } from './dto/mark-as-favorite.dto';
import { User } from '../common/decorators/user.decorator';
import { UserGuard } from '../common/guards/user.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    description: 'Create a new user',
  })
  @ApiOkResponse({
    description: 'Created user details',
    status: HttpStatus.CREATED,
    type: UserResponseDto,
  })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.createUser(createUserDto);
    return new UserResponseDto(user);
  }

  @ApiOperation({
    description: 'Mark Pokemon as favorite',
  })
  @ApiOkResponse({
    description: 'Pokemon marked as favorite successfully',
    status: HttpStatus.CREATED,
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('/favorites')
  @UseGuards(UserGuard)
  async markPokemonAsFavorite(
    @User() userId: number,
    @Body() markPokemonAsFavoriteDto: MarkAsFavoriteDto,
  ) {
    await this.userService.markPokemonAsFavorite({
      userId,
      pokemonId: markPokemonAsFavoriteDto.pokemonId,
    });
    return {
      message: 'Pokemon marked as favorite successfully',
    };
  }

  @ApiOperation({
    description: 'Remove Pokemon as favorite',
  })
  @ApiOkResponse({
    description: 'Pokemon removed from favoritessuccessfully',
    status: HttpStatus.OK,
  })
  @HttpCode(HttpStatus.OK)
  @Delete('/favorites')
  @UseGuards(UserGuard)
  async removePokemonFromFavorites(
    @User() userId: number,
    @Body() markPokemonAsFavoriteDto: MarkAsFavoriteDto,
  ) {
    await this.userService.removePokemonAsFavorite({
      userId,
      pokemonId: markPokemonAsFavoriteDto.pokemonId,
    });
    return {
      message: 'Pokemon removed from favorites successfully',
    };
  }
}
