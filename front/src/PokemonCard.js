import React from 'react'
import './styles/pokemon-card.css'

function PokemonCard({ poke, setSelectedPokemon }) {

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
        <div className={"poke-card"} onClick={() => setSelectedPokemon(poke)}>
            <div className={"id"}>#{zeroes(poke.id)}{poke.id}</div>
            <div className={"name"}>{poke.name.english}</div>
            <div className={"pic"}>
                <img src={`https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/images/${zeroes(poke.id)}${poke.id}.png`} alt={`Pokemon #${poke.id}: ${poke.name.english}`}></img>
            </div>
        </div>
    )
}

export default PokemonCard