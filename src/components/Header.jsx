import React from 'react';
import SearchIcon from './icons/searchIcon.jsx';

const Header = () => {
    return (
        <header className='flex fixed justify-around items-center w-full h-14 md:h-20 bg-blue-800 z-20'>

            <figure>
                <img src="/assets/images/logo.svg" alt="logo de pokemon" className='w-24 m-3 md:w-36'/>
            </figure>

            <aside className='flex relative items-center m-3 mr-7'>
                <input type="search" placeholder="Buscar..." 
                    className="font-[PokemonSolid] tracking-[0.15rem] rounded-l-full px-5 py-1 md:py-3 w-32 md:w-48 focus:w-44 md:focus:w-72 focus:outline focus:outline-2 transition-all duration-200 outline-none bg-yellow-600 text-white placeholder-[white]"
                />
                <span className="absolute top-1/2 -translate-y-[51%] md:-translate-y-1/2 left-full -translate-x-[45%] md:-translate-x-0 bg-yellow-600 p-[7.8px] md:p-[14.1px] rounded-r-full hover:cursor-pointer shadow-[inset_2px_0_rgba(255,255,255,0.2)]">
                    <SearchIcon className="size-4 md:size-5" />
                </span>
            </aside>
                
        </header>
    )
}

export default Header
