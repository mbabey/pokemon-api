import React from 'react'
import './pokemon-stats-styles.css'

function PokemonStats({ selectedPokemon }) {

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
        selectedPokemon &&
        <div className={"pokemon-stats"}>
            <div className={"stats-id"}>#{zeroes(selectedPokemon.id)}{selectedPokemon.id}</div>
            <div className={"stats-name"}>{selectedPokemon.name.english}</div>
            <div className={"stats-pic"}>
                <img src={`https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/images/${zeroes(selectedPokemon.id)}${selectedPokemon.id}.png`} alt={`Pokemon #${selectedPokemon.id}: ${selectedPokemon.name.english}`}></img>
            </div>
            <div className={"stats-block"}>
                <div className={"stat total"}></div>
                <div className={"stat hp"}></div>
                <div className={"stat attack"}></div>
                <div className={"stat defense"}></div>
                <div className={"stat sp-attack"}></div>
                <div className={"stat sp-defense"}></div>
                <div className={"stat speed"}></div>
            </div>
        </div>
    )
}

export default PokemonStats