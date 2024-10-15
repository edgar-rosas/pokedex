import { Title, Text, Container, Stack } from "@mantine/core";
export function NotFound() {
  return (
    <Container size="md" mb="lg">
      <Stack align="center" justify="center" gap="md">
        <Text c="red" fw={700} size="xl">
          404
        </Text>
        <Title>No results found.</Title>
        <Text c="dimmed" size="lg" ta="center">
          Try searching by a different name!
        </Text>
      </Stack>
    </Container>
  );
}
