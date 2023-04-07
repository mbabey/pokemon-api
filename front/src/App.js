import Login from "./Login";
import './styles/style.css'

function App() {

  const POKEDEX_AUTH_SERVER_URL = 'https://pokedex-auth-server.onrender.com';
  const POKEDEX_SERVER_URL = 'https://pokedex-server-z1j1.onrender.com';
  // const SERVER_URL = 'http://localhost';
  
  // const AUTH_PORT = 5011;
  // const SERVER_ADDRESS = `${SERVER_URL}:${AUTH_PORT}`;
  
  // const POKE_PORT = 5010;
  // const POKE_ADDRESS = `${SERVER_URL}:${POKE_PORT}`;

  return (
    <>
      <Login 
        SERVER_ADDRESS={POKEDEX_AUTH_SERVER_URL}
        POKE_ADDRESS={POKEDEX_SERVER_URL}
       />
    </>
  );
}

export default App;
