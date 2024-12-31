import React, { useState, useEffect } from 'react';
import { URL_POKEMON } from '../api/pokeapi';

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

const Cards = () => {

    const [pokemons, setPokemons] = useState([]);

    useEffect(() => {
        const fetchPokemonsData = async () => {
            try{
                const response = await fetch(URL_POKEMON);
                const data = await response.json();
                const pokemonUrls = data.results;

                const pokemonData = await Promise.all(
                    pokemonUrls.map(async (url) => {
                        const pokemonResponse = await fetch(url.url);
                        const pokemon = await pokemonResponse.json();
                        console.log('Pokemon: ', pokemon)
                        
                        const speciesResponse = await fetch(pokemon.species.url);
                        const species = await speciesResponse.json();


                        const evolvesResponse = await fetch(species.evolution_chain.url);
                        const evolves = await evolvesResponse.json();

                        const color = species.color.name;

                        return{
                            ...pokemon,
                            habitat: species.habitat ? species.habitat.name : 'Desconocido',
                            color: color,
                            evolves:  evolves.chain.species.name,
                        }
                    })
                );

                setPokemons(pokemonData);

            } catch (e){
                console.error('Error: ', e)
            }

            
        };

        fetchPokemonsData()
    }, []);
    
    return (
        <section className="grid grid-cols-[repeat(auto-fit,_minmax(300px,350px))] gap-x-14 gap-y-24 justify-center items-center pt-52 md:pt-64 px-44 ">
            {pokemons.map(pokemon => (
                <div key={pokemon.id} 
                    className="relative flex flex-col items-start p-4 rounded-lg text-white text-center pt-16 h-[500px] md:h-[550px] mb-32"
                    style={{backgroundColor:colors[pokemon.color] || '#3c3c3c'}}
                >
                    <img
                        src={pokemon.sprites.other['official-artwork'].front_default}
                        alt={`Imagen del Pokemon ${pokemon.name}`}
                        className="absolute bottom-[430px] md:bottom-[480px] right-1/2 translate-x-1/2 mx-auto size-48"
                    />
                    <h3 className='text-xs md:text-base absolute bottom-[460px] md:bottom-[505px] left-4 border-2 bg-white rounded-md text-black shadow-[inset_3px_5px_5px_0_rgba(0,0,0,0.5)] border-none p-1'>{pokemon.id}</h3>
                    <h3 className="text-xl md:text-2xl font-bold mb-2 mt-[-5px]">{pokemon.name}</h3>
                    <h4 className='text-xs md:text-base mb-1'><span className='font-bold'>Hábitat:</span> {pokemon.habitat}</h4>
                    <h4 className='text-xs md:text-base mb-1'><span className='font-bold'>Peso:</span> {pokemon.weight} kg</h4>
                    <h4 className='text-xs md:text-base mb-4'><span className='font-bold'>Altura:</span> {pokemon.height} cm</h4>
                    {pokemon.stats.map((stat, index) => (
                        <div key={index} className='flex gap-2 w-full justify-start'>
                            <h4 className='text-xs md:text-xs font-bold mb-1 text-black my-auto text-nowrap'>{stat.stat.name}</h4>
                            <progress value={stat.base_stat} max={110}
                                className='progress-bar'
                                style={{accentColor: colors[pokemon.color] || '#3c3c3c'}}
                            />
                            <h4 className='text-xs md:text-xs font-bold mb-1 text-black'>{stat.base_stat}</h4>
                        </div>
                    ))}

                    <div className='flex gap-5 mt-24 w-full justify-center'>
                        <div className=''>
                            <img src="https://pokemonletsgo.pokemon.com/assets/img/common/char-eevee.png" alt="" className='size-24' />
                            <h4 className='text-xs'>{pokemon.evolves}</h4>
                        </div>
                    </div>
                </div>
            ))}
        </section>
    );
};

export default Cards;
