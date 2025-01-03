import React, { useState, useEffect } from 'react';
import { URL_POKEMON } from '../api/pokeapi';
import Header from './Header'

const colors = {
    green: '#4faf6e',
    red: '#af4f4f',
    blue: '#4f9eaf',
    yellow: '#aeaf4f',
    black: '#252525',
    purple: '#6e4faf',
    pink: '#af4fac',
    brown: '#af6e4f',
    gray: '#8e8e8e',
    white: '#d0d0d0',
    multicolor: '#ff3c3c'
}

const typeColors = {
    normal: '#A8A77A',
    fire: '#EE8130',
    water: '#6390F0',
    electric: '#F7D02C',
    grass: '#7AC74C',
    ice: '#96D9D6',
    fighting: '#C22E28',
    poison: '#A33EA1',
    ground: '#E2BF65',
    flying: '#A98FF3',
    psychic: '#F95587',
    bug: '#A6B91A',
    rock: '#B6A136',
    ghost: '#735797',
    dragon: '#6F35FC',
    dark: '#705746',
    steel: '#B7B7CE',
    fairy: '#D685AD'
};


const Cards = () => {

    const [pokemons, setPokemons] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPokemonsData = async () => {
            try{
                const response = await fetch(URL_POKEMON);
                const data = await response.json();
                const pokemonUrls = data.results;

                const pokemonData = await Promise.all(
                    pokemonUrls.map(async (url) => {
                        const pokemonResponse = await fetch(url.url);
                        const pokemon = await pokemonResponse.json()
                        
                        const speciesResponse = await fetch(pokemon.species.url);
                        const species = await speciesResponse.json();

                        const color = species.color.name;

                        const evolvesResponse = await fetch(species.evolution_chain.url);
                        const evolves = await evolvesResponse.json();

                        const extractEvolutions = async (chain) => {
                            const evolutions = []
                            let current = chain;
                        
                            while (current) {
                                const response = await fetch(current.species.url)
                                const data = await response.json()

                                const res = await fetch (`https://pokeapi.co/api/v2/pokemon/${data.id}`)
                                const da = await res.json();
                                const urlImage = da.sprites.other['official-artwork'].front_default

                                evolutions.push({
                                    name: current.species.name,
                                    url: urlImage,
                                })

                                if (current.evolves_to.length > 0) {
                                    current = current.evolves_to[0];
                                } else {
                                    current = null;
                                }
                            }
                            return evolutions;
                        };
                        
                        const evolutionChain = await extractEvolutions(evolves.chain);

                        return{
                            ...pokemon,
                            habitat: species.habitat ? species.habitat.name : 'Desconocido',
                            color: color,
                            evolves:  evolutionChain,
                        }
                    })
                );
                setLoading(false);
                setPokemons(pokemonData);
                window.scrollTo(0, 0);

            } catch (e){
                setLoading(true);
                console.error('Error: ', e);
            }
            
        };

        fetchPokemonsData()
    }, []);

    if(loading){
        return(
            <section className='flex justify-center items-center h-screen w-full z-20'>
                <h2 className='text-2xl md:text-5xl text-white font-[PokemonSolid] tracking-[0.15rem]'>CARGANDO POKÉMON...</h2>
            </section>
        )
    }
    
    return (
        <section className="grid grid-cols-[repeat(auto-fit,_minmax(300px,350px))] gap-x-14 gap-y-24 justify-center items-center pt-52 md:pt-64 px-44 ">
            {pokemons.map(pokemon => (
                <div key={pokemon.id} 
                    className="relative flex flex-col items-start p-4 rounded-lg text-white text-center pt-16 mb-32"
                    style={{backgroundColor:colors[pokemon.color] || '#3c3c3c'}}
                >
                    <img
                        src={pokemon.sprites.other['official-artwork'].front_default}
                        alt={`Imagen del Pokemon ${pokemon.name}`}
                        className="absolute bottom-[370px] md:bottom-[450px] right-1/2 translate-x-1/2 mx-auto size-40 md:size-48"
                        loading='lazy'
                    />
                    <h3 className='text-xs md:text-base absolute bottom-[405px] md:bottom-[485px] left-4 border-2 bg-white rounded-md text-black shadow-[inset_5px_5px_10px_rgba(0,0,0)] px-3 border-none p-1 font-[PokemonSolid] tracking-[0.15rem]'>{pokemon.id}</h3>
                    <h3 className="text-xl md:text-2xl font-bold text-black mb-3 mt-[-5px] font-[PokemonSolid] tracking-[0.25rem]">{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h3>
                    <h4 className='text-xs md:text-base font-[Nunito]'><span className='font-bold'>Hábitat:</span> {pokemon.habitat.charAt(0).toUpperCase() + pokemon.habitat.slice(1)}</h4>
                    <h4 className='text-xs md:text-base font-[Nunito]'><span className='font-bold'>Altura:</span> {(pokemon.height / 10)} m</h4>
                    <h4 className='text-xs md:text-base mb-3 font-[Nunito]'><span className='font-bold'>Peso:</span> {(pokemon.weight / 10)} kg</h4>
                    
                    {pokemon.stats.map((stat, index) => (
                        <div key={index} className='flex gap-2 w-full justify-start'>
                            <h4 className='text-xs md:text-base font-bold text-black my-auto text-nowrap font-[Nunito]'>{stat.stat.name.charAt(0).toUpperCase() + stat.stat.name.slice(1)}</h4>
                            <progress value={stat.base_stat} max={110}
                                className='progress-bar my-auto ms-auto'
                                style={{accentColor: colors[pokemon.color] || '#3c3c3c'}}
                            />
                            <h4 className='text-xs md:text-base font-bold text-black font-[Nunito]'>{stat.base_stat}</h4>
                        </div>
                    ))}
                    
                    <div className='flex w-full justify-between mt-3 '>
                        {pokemon.types.map((type, index) => (
                            <div key={index} className='h-7 md:h-10 font-[PokemonSolid] tracking-[0.15rem] text-xs md:text-base text-black rounded-md px-2 shadow-[inset_5px_5px_10px_black] p-1'
                                style={{backgroundColor:typeColors[type.type.name] || '#3c3c3c'}}
                            >
                                {type.type.name}
                            </div>
                        ))}
                    </div>

                    <div className='flex gap-5 mt-5 w-full justify-center'>
                        {pokemon.evolves.map((evolve, index) => (
                            <div key={index} className=''>
                                <img src={evolve.url} alt={`Pokemon ${evolve.name}`} className='size-24' />
                                <h4 className='text-xs font-[PokemonSolid] tracking-[0.15rem] text-black'>{evolve.name}</h4>
                            </div>
                        ))}
                    </div>

                </div>
            ))}
        </section>
    );
};

export default Cards;
