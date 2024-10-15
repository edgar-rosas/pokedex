import { Group, Image } from "@mantine/core";

export function Header() {
  return (
    <Group h="100%" px="md">
      <Image
        radius="md"
        h={60}
        w="auto"
        fit="contain"
        src="https://i.ibb.co/9bYDrBH/PokeIcon.png"
      />
      <h1>Pokedex</h1>
    </Group>
  );
}
