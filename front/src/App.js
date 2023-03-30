import Login from "./Login";
import Search from "./Search";
import Result from "./Result";
import { useState } from "react";

function App() {
  const [selectedTypes, setSelectedTypes] = useState([])

  return (
    <>
      {/* <Login /> */}
      <Search
        selectedTypes={selectedTypes}
        setSelectedTypes={setSelectedTypes}
      />
      <Result
        selectedTypes={selectedTypes}
      />
    </>
  );
}

export default App;
