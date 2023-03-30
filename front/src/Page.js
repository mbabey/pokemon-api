import React from 'react'
import './style.css'

function Page({ pokemon, PAGE_SIZE, currentPage }) {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = (startIndex + PAGE_SIZE);
    pokemon = pokemon.slice(startIndex, endIndex);
    const zeroes = (id) => {
        if (id < 10) {
            return "00"
        }
        if (id < 100) {
            return "0"
        }
        return ""
    }
    return (
        <div className={"images"}>
            {
                pokemon.map(poke => {
                    return <div key={poke.name.english}>
                        <img src={`https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/images/${zeroes(poke.id)}${poke.id}.png`} alt={`Pokemon ${poke.id}`}></img>
                    </div>
                })
            }
        </div>
    )
}

export default Page