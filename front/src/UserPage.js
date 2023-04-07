import React from 'react'
import Search from "./Search";
import Result from "./Result";
import { useState } from "react";

function UserPage({ accessToken, refreshToken, setAccessToken, POKE_ADDRESS, SERVER_ADDRESS }) {
    const PAGE_SIZE = 10;
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [queryName, setQueryName] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
  
    return (
        <>
            <Search
                selectedTypes={selectedTypes}
                setSelectedTypes={setSelectedTypes}
                setQueryName={setQueryName}
            />
            <Result
                selectedTypes={selectedTypes}
                queryName={queryName}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                accessToken={accessToken}
                refreshToken={refreshToken}
                setAccessToken={setAccessToken}
                PAGE_SIZE={PAGE_SIZE}
                POKE_ADDRESS={POKE_ADDRESS}
                SERVER_ADDRESS={SERVER_ADDRESS}
            />
        </>
    )
}

export default UserPage