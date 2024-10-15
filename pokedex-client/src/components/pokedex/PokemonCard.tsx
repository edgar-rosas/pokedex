import { Card, Image, Text, Badge, Group } from "@mantine/core";
import { Pokemon } from "../../api/pokedex.api";

type PokemonCardProps = {
  pokemon: Pokemon;
};

export function PokemonCard({ pokemon }: PokemonCardProps) {
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
        <Badge color="pink">On Sale</Badge>
      </Group>
    </Card>
  );
}
