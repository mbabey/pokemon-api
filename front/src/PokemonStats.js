import React from 'react'
import './styles/pokemon-stats-styles.css'

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
                <div className={"statname hp"}>HP:</div><div className={"statbar hp"}>{selectedPokemon.base["HP"]}</div>
                <div className={"statname attack"}>Attack:</div><div className={"statbar attack"}>{selectedPokemon.base["Attack"]}</div>
                <div className={"statname defense"}>Defense:</div><div className={"statbar defense"}>{selectedPokemon.base["Defense"]}</div>
                <div className={"statname spattack"}>SpAttack:</div><div className={"statbar spattack"}>{selectedPokemon.base["Sp. Attack"]}</div>
                <div className={"statname spdefense"}>SpDefense:</div><div className={"statbar spdefense"}>{selectedPokemon.base["Sp. Defense"]}</div>
                <div className={"statname speed"}>Speed:</div><div className={"statbar speed"}>{selectedPokemon.base["Speed"]}</div>
                <div className={"statname total"}>Total:</div><div className={"statbar total"}>{calculateTotal(selectedPokemon.base)}</div>
            </div>
        </div>
    )
}

export default PokemonStats