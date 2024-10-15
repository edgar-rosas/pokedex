import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { PokemonCard } from "../components/pokedex/PokemonCard";
import { Pagination, SimpleGrid } from "@mantine/core";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  const data = Route.useLoaderData();
  const { page, name } = Route.useSearch();
  const navigate = useNavigate({ from: "/" });

  const cards = data.pokemon.map((p) => {
    return <PokemonCard key={p.id} pokemon={p} />;
  });

  return (
    <div className="p-2">
      <SimpleGrid
        cols={{ base: 1, sm: 2, lg: 4 }}
        spacing={{ base: 10, sm: "xl" }}
        verticalSpacing={{ base: "md", sm: "xl" }}
      >
        {cards}
      </SimpleGrid>
      <Pagination
        total={Math.ceil(data.count / 20)}
        value={page || 1}
        onChange={(val: number) => {
          navigate({
            search: { page: val, name },
          });
        }}
        mt="sm"
      />
    </div>
  );
}
