import { AppProviders } from "./providers";
import Chat from "./components/Chat";
import "./index.css";
import "./App.css";
import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
function App() {
  return (
    <MantineProvider>
      <AppProviders>
        <Chat />
      </AppProviders>
    </MantineProvider>
  );
}

export default App;
