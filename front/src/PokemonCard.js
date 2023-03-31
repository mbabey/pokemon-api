import React from 'react'
import './style.css'

function PokemonCard({ poke }) {

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
        <div>
            <div className={"id-name"}>
                <div className={"id"}>{poke.id}</div>
                <div className={"name"}>{poke.name.english}</div>
            </div>
            <div>
                <img src={`https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/images/${zeroes(poke.id)}${poke.id}.png`} alt={`Pokemon ${poke.id}`}></img>
            </div>
        </div>
    )
}

export default PokemonCard