import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { PokemonCard } from "../components/pokedex/PokemonCard";
import {
  Container,
  Group,
  Pagination,
  SimpleGrid,
  TextInput,
} from "@mantine/core";
import { useDebouncedCallback } from "@mantine/hooks";
import { useState } from "react";
import { FavoriteBodyRequest, markAsFavorite } from "../api/users.api";
import { notifications } from "@mantine/notifications";
import { NotFound } from "../components/NotFound";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  const data = Route.useLoaderData();
  const { page, name } = Route.useSearch();
  const navigate = useNavigate({ from: "/" });

  const [search, setSearch] = useState(name);

  const handleFavorite = useDebouncedCallback(
    async (params: FavoriteBodyRequest) => {
      const res = await markAsFavorite(params);
      if (res.status === 201 || res.status === 200) {
        notifications.show({
          title: "Update successful",
          color: "green",
          position: "top-right",
          message: res.data.message,
        });
      }
    },
    500
  );

  const handleSearch = useDebouncedCallback(async (query: string) => {
    navigate({
      search: { page, name: query },
    });
  }, 500);

  const cards = data.pokemon.map((p) => {
    return (
      <PokemonCard key={p.id} pokemon={p} handleFavorite={handleFavorite} />
    );
  });

  return (
    <div>
      <Container size="md" mb="lg">
        <Group justify="center" grow>
          <TextInput
            label="Search Pokemon by name"
            placeholder="Search by name"
            value={search}
            onChange={(event) => {
              setSearch(event.currentTarget.value);
              handleSearch(event.currentTarget.value);
            }}
          />
        </Group>
      </Container>
      {data.pokemon.length > 0 && data.count > 0 ? (
        <Container>
          <SimpleGrid
            cols={{ base: 1, sm: 2, lg: 5 }}
            spacing={{ base: 10, sm: "xl" }}
            verticalSpacing={{ base: "md", sm: "xl" }}
          >
            {cards}
          </SimpleGrid>
          <Group justify="center">
            <Pagination
              color="red"
              radius="xl"
              total={Math.ceil(data.count / 20)}
              value={page || 1}
              onChange={(val: number) => {
                navigate({
                  search: { page: val, name },
                });
              }}
              mt="sm"
            />
          </Group>
        </Container>
      ) : (
        <NotFound />
      )}
    </div>
  );
}
