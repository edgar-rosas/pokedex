export class PokemonDetailsDto {
  id: number;
  name: string;
  sprites: SpritesDto;
}

class SpritesDto {
  front_default: string;
}
