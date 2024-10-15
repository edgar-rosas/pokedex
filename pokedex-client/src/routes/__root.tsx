import { AppShell, createTheme, MantineProvider } from "@mantine/core";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { Header } from "../components/Header";

const theme = createTheme({});

export const Route = createRootRoute({
  component: () => (
    <>
      <MantineProvider theme={theme}>
        <AppShell
          header={{ height: { base: 60, md: 70, lg: 80 } }}
          padding="md"
        >
          <AppShell.Header>
            <Header />
          </AppShell.Header>
          <AppShell.Main>
            <Outlet />
          </AppShell.Main>
          <TanStackRouterDevtools />
        </AppShell>
      </MantineProvider>
      <hr />
    </>
  ),
});
