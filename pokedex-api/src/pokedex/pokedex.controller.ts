import { Controller, Get, HttpStatus, Query } from '@nestjs/common';
import { FindAllPokemonQueryDto } from './dto/find-all-pokemon-query.dto';
import { PokedexService } from './pokedex.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FindAllPokemonResponseDto } from './dto/find-all-pokemon-response.dto';
import { User } from '../common/decorators/user.decorator';

@ApiTags('pokedex')
@Controller('pokedex')
export class PokedexController {
  constructor(private readonly pokedexService: PokedexService) {}

  @ApiOperation({
    description: 'Get all Pokemon',
  })
  @ApiOkResponse({
    description: 'List of Pokemon found',
    status: HttpStatus.OK,
    type: FindAllPokemonResponseDto,
  })
  @Get()
  async findAll(@Query() query: FindAllPokemonQueryDto, @User() user?) {
    const data = await this.pokedexService.findAll(query, user);
    return new FindAllPokemonResponseDto(data);
  }
}
