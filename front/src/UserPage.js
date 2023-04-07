import React from 'react'
import Search from "./Search";
import Result from "./Result";
import { useState } from "react";

function UserPage({ accessToken, refreshToken, setAccessToken, POKE_ADDRESS, SERVER_ADDRESS }) {
    
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [queryName, setQueryName] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(81); 

    // If the total number of pages is less than the current page, set the current page to the last page.
    if (totalPages < currentPage) 
    {
        setCurrentPage(totalPages);
    }

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
                setTotalPages={setTotalPages}
                accessToken={accessToken}
                refreshToken={refreshToken}
                setAccessToken={setAccessToken}
                POKE_ADDRESS={POKE_ADDRESS}
                SERVER_ADDRESS={SERVER_ADDRESS}
            />
        </>
    )
}

export default UserPage