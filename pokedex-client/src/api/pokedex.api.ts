import { PokemonSearch } from "../routes";
import axiosClient from "./axios";

export const fetchAllPokemon = async (params: PokemonSearch) => {
  return axiosClient.get("/pokedex", {
    params: {
      ...params,
      offset: params.page ? params.page * 20 : undefined,
    },
  });
};
