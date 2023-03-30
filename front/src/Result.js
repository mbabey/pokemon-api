import React from 'react'
import axios from 'axios'
import { useState, useEffect } from 'react'

function Result() {
    const [pokemon, setPokemon] = useState('');

    useEffect(() => {
        async function fetchData() {
            const res = await axios.get('https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/pokedex.json')
            setPokemon(res.data);
        }
        fetchData();
    }, [])

    return (
        <div>Result</div>
    )
}

export default Result