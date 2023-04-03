import Login from "./Login";
import './styles/style.css'

function App() {

  const PORT = 5011;
  const SERVER_ADDRESS = `http://localhost:${PORT}`

  return (
    <>
      <Login SERVER_ADDRESS={SERVER_ADDRESS} />
    </>
  );
}

export default App;
