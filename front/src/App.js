import Login from "./Login";
import './styles/style.css'

function App() {

  const AUTH_PORT = 5011;
  const SERVER_ADDRESS = `http://localhost:${AUTH_PORT}`;
  const POKE_PORT = 5010;
  const POKE_ADDRESS = `http://localhost:${POKE_PORT}`;

  return (
    <>
      <Login 
        SERVER_ADDRESS={SERVER_ADDRESS}
        POKE_ADDRESS={POKE_ADDRESS}
       />
    </>
  );
}

export default App;
