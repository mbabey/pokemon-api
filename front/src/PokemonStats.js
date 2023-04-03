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

    const calculateTotal = (base) => {
        return base["HP"] + base["Attack"] + base["Defense"] + base["Sp. Attack"] + base["Sp. Defense"] + base["Speed"];
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
                <div className={"stat total"}>{calculateTotal(selectedPokemon.base)}</div>
                <div className={"stat hp"}>{selectedPokemon.base["HP"]}</div>
                <div className={"stat attack"}>{selectedPokemon.base["Attack"]}</div>
                <div className={"stat defense"}>{selectedPokemon.base["Defense"]}</div>
                <div className={"stat sp-attack"}>{selectedPokemon.base["Sp. Attack"]}</div>
                <div className={"stat sp-defense"}>{selectedPokemon.base["Sp. Defense"]}</div>
                <div className={"stat speed"}>{selectedPokemon.base["Speed"]}</div>
            </div>
        </div>
    )
}

export default PokemonStats