import { Card, Image, Text, Group, Chip } from "@mantine/core";
import { Pokemon } from "../../api/pokedex.api";
import { useState } from "react";
import { FavoriteBodyRequest } from "../../api/users.api";

type PokemonCardProps = {
  pokemon: Pokemon;
  handleFavorite: (params: FavoriteBodyRequest) => void;
};

export function PokemonCard({ pokemon, handleFavorite }: PokemonCardProps) {
  const [favorite, setFavorite] = useState(pokemon.isFavorite);

  const onChangeFavorite = () => {
    setFavorite((f) => {
      handleFavorite({ pokemonId: pokemon.id, isFavorite: !f });
      return !f;
    });
  };

  return (
    <Card shadow="sm" padding="sm" radius="md" withBorder>
      <Card.Section>
        <Group justify="center" gap="sm">
          <Image
            w="auto"
            fit="contain"
            src={pokemon.image}
            height={128}
            alt={pokemon.name}
          />
        </Group>
      </Card.Section>

      <Group justify="space-between" mt="md" mb="xs">
        <Text fw={500}>{pokemon.name}</Text>
        <Chip onChange={onChangeFavorite} checked={favorite} color="yellow">
          Favorite
        </Chip>
      </Group>
    </Card>
  );
}
