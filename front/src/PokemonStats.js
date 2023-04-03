import React from 'react'
import './pokemon-stats-styles.css'

function PokemonStats({ selectedPokemon, setSelectedPokemon }) {

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
            <span className={"stats-close"} onClick={() => setSelectedPokemon(null)} >X</span>
            <div className={"stats-id"}>#{zeroes(selectedPokemon.id)}{selectedPokemon.id}</div>
            <div className={"stats-name"}>{selectedPokemon.name.english}</div>
            <div className={"stats-pic"}>
                <img src={`https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/images/${zeroes(selectedPokemon.id)}${selectedPokemon.id}.png`} alt={`Pokemon #${selectedPokemon.id}: ${selectedPokemon.name.english}`}></img>
            </div>
            <div className={"stats-block"}>
                <div className={"stat hp"}>HP: {selectedPokemon.base["HP"]}</div>
                <div className={"stat attack"}>Attack: {selectedPokemon.base["Attack"]}</div>
                <div className={"stat defense"}>Defense: {selectedPokemon.base["Defense"]}</div>
                <div className={"stat sp-attack"}>Sp. Attack: {selectedPokemon.base["Sp. Attack"]}</div>
                <div className={"stat sp-defense"}>Sp. Defense: {selectedPokemon.base["Sp. Defense"]}</div>
                <div className={"stat speed"}>Speed: {selectedPokemon.base["Speed"]}</div>
                <div className={"stat total"}>Total: {calculateTotal(selectedPokemon.base)}</div>
            </div>
        </div>
    )
}

export default PokemonStats