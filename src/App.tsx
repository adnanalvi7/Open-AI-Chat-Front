import { AppProviders } from './providers';
import Chat from './components/Chat';

function App() {
  return (
    <AppProviders>
      <Chat />
    </AppProviders>
  );
}

export default App;