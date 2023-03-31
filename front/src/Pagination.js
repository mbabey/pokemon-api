import React from 'react'
import './style.css'

function Pagination({ pokemon, PAGE_SIZE, setCurrentPage, currentPage }) {
    const pokePages = Math.ceil(pokemon.length / PAGE_SIZE);

  return (
    <div>
        {
            (currentPage !== 1) && <button onClick={() => setCurrentPage(currentPage - 1)}>Prev</button>
        }
        {
            Array.from({ length: pokePages }, (_, i) => i)
            .slice((currentPage - 5 < 0) ? 0 : currentPage - 5,
                   (currentPage + 5 > pokePages) ? pokePages : currentPage + 5)
            .map(num => {
                return <button 
                key={num} onClick={() => setCurrentPage(num + 1)}
                className={((currentPage === num + 1) ?  "buttonActive" : "")} 
                >{num + 1}</button>
            })
        }
        {
            (currentPage !== pokePages) && <button onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
        }
    </div>
  )
}

export default Pagination