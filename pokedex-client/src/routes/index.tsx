import { createFileRoute } from "@tanstack/react-router";

import { z } from "zod";
import { fetchAllPokemon } from "../api/pokedex.api";
import { createUser } from "../api/users.api";

const pokemonSearchSchema = z.object({
  page: z.number().optional(),
  name: z.string().optional(),
});

export type PokemonSearch = z.infer<typeof pokemonSearchSchema>;

export const Route = createFileRoute("/")({
  validateSearch: pokemonSearchSchema,
  beforeLoad: async () => {
    const storedUserId = localStorage.getItem("userId");
    if (!storedUserId) {
      return createUser();
    }
  },
  // Pass the offset to your loader deps via the loaderDeps function
  loaderDeps: ({ search: { page, name } }) => ({ page, name }),
  // Use the offset from context in the loader function
  loader: async ({ deps: { page, name } }) =>
    fetchAllPokemon({
      page,
      name,
    }),
});
