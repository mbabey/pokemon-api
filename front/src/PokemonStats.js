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
    <div>
        <div className={"id"}>#{zeroes(selectedPokemon.id)}{selectedPokemon.id}</div>
            <div className={"name"}>{selectedPokemon.name.english}</div>
            <div className={"pic"}>
                <img src={`https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/images/${zeroes(selectedPokemon.id)}${selectedPokemon.id}.png`} alt={`Pokemon #${selectedPokemon.id}: ${selectedPokemon.name.english}`}></img>
            </div>
    </div>
  )
}

export default PokemonStats