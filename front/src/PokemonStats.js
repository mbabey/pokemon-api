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

    const setStatBarWidth = (stat) => {
        return (stat / 255) * 100;
    }

    const setTotalBarWidth = (total) => {
        return (total / 720) * 100;
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
                <div className={"statname hp"}>HP:</div>
                <div className={"statbar hp"}
                    style={{ width: `${setStatBarWidth(selectedPokemon.base["HP"])}%` }}>{selectedPokemon.base["HP"]}</div>

                <div className={"statname attack"}>Attack:</div>
                <div className={"statbar attack"}
                    style={{ width: `${setStatBarWidth(selectedPokemon.base["Attack"])}%` }}>{selectedPokemon.base["Attack"]}</div>

                <div className={"statname defense"}>Defense:</div>
                <div className={"statbar defense"}
                    style={{ width: `${setStatBarWidth(selectedPokemon.base["Defense"])}%` }}>{selectedPokemon.base["Defense"]}</div>

                <div className={"statname sp-attack"}>Sp. Attack:</div>
                <div className={"statbar sp-attack"}
                    style={{ width: `${setStatBarWidth(selectedPokemon.base["Special Attack"])}%` }}>{selectedPokemon.base["Sp. Attack"]}</div>

                <div className={"statname sp-defense"}>Sp. Defense:</div>
                <div className={"statbar sp-defense"}
                    style={{ width: `${setStatBarWidth(selectedPokemon.base["Special Defense"])}%` }}>{selectedPokemon.base["Sp. Defense"]}</div>

                <div className={"statname speed"}>Speed:</div>
                <div className={"statbar speed"}
                    style={{ width: `${setStatBarWidth(selectedPokemon.base["Speed"])}%` }}>{selectedPokemon.base["Speed"]}</div>

                <div className={"statname total"}>Total:</div>
                <div className={"statbar total"}
                    style={{ width: `${setTotalBarWidth(calculateTotal(selectedPokemon.base))}%` }}>{calculateTotal(selectedPokemon.base)}</div>

            </div>
        </div>
    )
}

export default PokemonStats