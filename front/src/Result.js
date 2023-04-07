import React from 'react'
import axios from 'axios'
import jwt_decode from 'jwt-decode'
import { useState, useEffect } from 'react'
import Pagination from './Pagination';
import PokemonCard from './PokemonCard';
import PokemonStats from './PokemonStats';

// const POKE_JSON = 'https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/pokedex.json';

function Result({ selectedTypes, queryName, currentPage, setCurrentPage, setTotalPages,
    accessToken, refreshToken, setAccessToken, POKEDEX_AUTH_SERVER_URL, POKEDEX_SERVER_URL }) {

    const PAGE_SIZE = 10;
    const [pokedex, setPokedex] = useState([]);
    const [selectedPokemon, setSelectedPokemon] = useState(null);

    const axiosToBeIntercepted = axios.create();
    axiosToBeIntercepted.interceptors.request.use(async (config) => {
        const decoded = jwt_decode(accessToken);
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
            console.log("token expired");
            try {
                const res = await axios.post(`${POKEDEX_AUTH_SERVER_URL}/requestNewAccessToken`, {},
                    {
                        headers: { 'authorization': refreshToken }
                    });
                setAccessToken(res.headers['authorization']);
                config.headers['authorization'] = res.headers['authorization'];
            } catch (err) {
                console.log(err.message);
            }
        }

        return config;
    }, (err) => {
        return Promise.reject(err);
    });


    useEffect(() => {
        async function fetchData() {
            const res = await axiosToBeIntercepted.get(`${POKEDEX_SERVER_URL}/api/v1/pokedex`, {
                headers: { 'authorization': accessToken }
            })
            setPokedex(res.data);
        }
        if (pokedex.length === 0) {
            fetchData();
        }
    })

    async function getPokemon(id) {
        const res = await axiosToBeIntercepted.get(`${POKEDEX_SERVER_URL}/api/v1/pokemon?id=${id}`, {
            headers: { 'authorization': accessToken }
        });
        setSelectedPokemon(res.data);
    }

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
                                getPokemon={getPokemon}
                            />
                        )
                    })
                }
            </div>
            <Pagination
                pokemon={pokemon}
                PAGE_SIZE={PAGE_SIZE}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                setTotalPages={setTotalPages}
            />
            <PokemonStats
                selectedPokemon={selectedPokemon}
                setSelectedPokemon={setSelectedPokemon}
            />
        </div>
    )
}

export default Result
