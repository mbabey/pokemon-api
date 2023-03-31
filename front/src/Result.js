import React from 'react'
import axios from 'axios'
import { useState, useEffect } from 'react'
import Pagination from './Pagination';

function Result({ selectedTypes, queryName, currentPage, setCurrentPage, PAGE_SIZE }) {
    const [pokedex, setPokedex] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const res = await axios.get('https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/pokedex.json')
            setPokedex(res.data);
        }
        fetchData();
    }, [])

    const zeroes = (id) => {
        if (id < 10) {
            return "00"
        }
        if (id < 100) {
            return "0"
        }
        return ""
    }

    const regex = `/^.*${queryName}.*$/gm`
    console.log(regex);
    console.log(regex.match('pikachu'));

    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = (startIndex + PAGE_SIZE);
    let pokemon = pokedex.filter(poke => selectedTypes.every((type => poke.type.includes(type))) && regex.match(poke.name.english));
    let pokemonOnPage = pokemon.slice(startIndex, endIndex);

    return (
        <div>
            <div className={"images"}>
                {
                    pokemonOnPage.map(poke => {
                        return (
                            <div key={poke.name.english}>
                                <img src={`https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/images/${zeroes(poke.id)}${poke.id}.png`} alt={`Pokemon ${poke.id}`}></img>
                            </div>
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
