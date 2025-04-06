import './App.css';
import Rotas from './rotas';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Rotas />
    </AuthProvider>
  );
}

export default App;