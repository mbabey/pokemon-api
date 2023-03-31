import React from 'react'
import axios from 'axios'
import { useState, useEffect } from 'react'
import Pagination from './Pagination';
import PokemonCard from './PokemonCard';

function Result({ selectedTypes, queryName, currentPage, setCurrentPage, PAGE_SIZE }) {
    const [pokedex, setPokedex] = useState([]);

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
        </div>
    )
}

export default Result
