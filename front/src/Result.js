import React from 'react'
import axios from 'axios'
import { useState, useEffect } from 'react'
import Pagination from './Pagination';
import PokemonCard from './PokemonCard';
import PokemonStats from './PokemonStats';

function Result({ selectedTypes, queryName, currentPage, setCurrentPage, PAGE_SIZE }) {
    const [pokedex, setPokedex] = useState([]);
    const [selectedPokemon, setSelectedPokemon] = useState(null);

    useEffect(() => {
        async function fetchData() {
            const res = await axios.get('https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/pokedex.json')
            setPokedex(res.data);
        }
        fetchData();
    }, [])

    const regex = new RegExp(`^.*${queryName}.*$`, 'im');
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = (startIndex + PAGE_SIZE);

    let pokemon = pokedex.filter(poke => selectedTypes.every((type => poke.type.includes(type))) && (poke.name.english).match(regex));
    let pokemonOnPage = pokemon.slice(startIndex, endIndex);

    return (
        <div>
            <div className={"pokemon-card-container"}>
                {
                    pokemonOnPage.map(poke => {
                        return (
                            <PokemonCard
                                key={poke.name.english}
                                poke={poke}
                                setSelectedPokemon={setSelectedPokemon}
                            />
                        )
                    })
                }
            </div>
            <Pagination
                pokemon={pokemon}
                PAGE_SIZE={PAGE_SIZE}
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
            />
            <PokemonStats selectedPokemon={selectedPokemon} />
        </div>
    )
}

export default Result
