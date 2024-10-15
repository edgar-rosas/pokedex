import { AppShell, createTheme, MantineProvider } from "@mantine/core";
import { Header } from "./components/Header";

const theme = createTheme({});

function App() {
  return (
    <MantineProvider theme={theme}>
      <AppShell header={{ height: { base: 60, md: 70, lg: 80 } }} padding="md">
        <AppShell.Header>
          <Header />
        </AppShell.Header>
        <AppShell.Main>
          <div>Hello</div>
        </AppShell.Main>
      </AppShell>
    </MantineProvider>
  );
}

export default App;
