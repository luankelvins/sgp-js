import './App.css';
import Rotas from './rotas';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Rotas />
    </AuthProvider>
  );
  console.log("API em uso:", process.env.REACT_APP_API_URL);
}

export default App;