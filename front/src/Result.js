import React from 'react'
import axios from 'axios'
import { useState, useEffect } from 'react'

function Result({ selectedTypes }) {
    const [pokemon, setPokemon] = useState('');

    useEffect(() => {
        async function fetchData() {
            const res = await axios.get('https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/pokedex.json')
            setPokemon(res.data);
        }
        fetchData();
    }, [])

    return (
        <div>
            {
                pokemon.map(poke => {
                    if (selectedTypes.length === 0)
                    {
                        return (<></>)
                    }
                    if (selectedTypes.every((type => poke.type.includes(type))))
                    {
                        return (
                            <>
                                {poke.name.english}
                                <br />
                            </>
                        )
                    }
                })
            }
        </div>
    )
}

isSelected = 

export default Result