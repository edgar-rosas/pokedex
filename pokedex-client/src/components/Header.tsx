import { Group, Image } from "@mantine/core";
import { Link } from "@tanstack/react-router";

export function Header() {
  return (
    <Group h="100%" px="md">
      <Link to="/" className="[&.active]:font-bold">
        <Image
          radius="md"
          h={50}
          w="auto"
          fit="contain"
          src="https://i.ibb.co/9bYDrBH/PokeIcon.png"
        />
      </Link>
      <h1>Pokedex</h1>
    </Group>
  );
}
