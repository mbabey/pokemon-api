import Login from "./Login";
import Search from "./Search";
import Result from "./Result";
import { useState } from "react";

function App() {
  const PAGE_SIZE = 10;
  const [selectedTypes, setSelectedTypes] = useState([])
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <>
      {/* <Login /> */}
      <Search
        selectedTypes={selectedTypes}
        setSelectedTypes={setSelectedTypes}
      />
      <Result
        selectedTypes={selectedTypes}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        PAGE_SIZE={PAGE_SIZE}
      />
    </>
  );
}

export default App;
