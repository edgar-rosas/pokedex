export class PokemonListDto {
  count: number;
  next?: string;
  previous?: string;
  results: PokemonResultDto[];
}

class PokemonResultDto {
  name: string;
  url: string;
}
