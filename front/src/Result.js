import React from 'react'
import axios from 'axios'
import { useState, useEffect } from 'react'
import Page from './Page';
import Pagination from './Pagination';

function Result({ selectedTypes, currentPage, setCurrentPage, PAGE_SIZE }) {
    const [pokedex, setPokedex] = useState([]);
    // const [pokemon, setPokemon] = useState([]);
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = (startIndex + PAGE_SIZE);

    let pokemon = pokedex.filter(poke => selectedTypes.every((type => poke.type.includes(type)))).slice(startIndex, endIndex);
    console.log(pokemon);
    console.log(startIndex);
    console.log(endIndex);

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
    return (
        <div>
            <div className={"images"}>
                {
                    pokemon.map(poke => {
                        return (
                            <div key={poke.name.english}>
                                <img src={`https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/images/${zeroes(poke.id)}${poke.id}.png`} alt={`Pokemon ${poke.id}`}></img>
                            </div>
                        )
                    })
                }
            </div>
            <Pagination
                pokedex={pokedex}
                PAGE_SIZE={PAGE_SIZE}
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
            />
        </div>
    )
}

export default Result


                // setPokemon(pokedex.filter(poke => {
                //     selectedTypes.includes(poke.type)
                // }))

                            // console.log(pokedex.map(poke => {
                //     if (selectedTypes.length === 0) {
                //         return null;
                //     }
                //     if (selectedTypes.every((type => poke.type.includes(type)))) {
                //         return poke;
                //     }
                //     return poke;
                // }))

            //     <Page
            //     pokemon={pokemon}
            //     PAGE_SIZE={PAGE_SIZE}
            //     currentPage={currentPage}
            // />

