import { PokemonSearch } from "../routes";
import axiosClient from "./axios";

export type FetchPokemonResponse = {
  count: number;
  pokemon: Pokemon[];
};

export type Pokemon = {
  id: number;
  name: string;
  image: string;
  isFavorite: boolean;
};

export const fetchAllPokemon = async (
  params: PokemonSearch
): Promise<FetchPokemonResponse> => {
  const res = await axiosClient.get<FetchPokemonResponse>("/pokedex", {
    params: {
      name: params.name ? params.name : undefined,
      offset:
        params.page && params.page > 1 ? params.page * 20 - 20 : undefined,
    },
  });

  return res.data;
};
