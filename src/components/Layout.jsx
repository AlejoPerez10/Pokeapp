import React from 'react'
import Header from './Header'
import Footer from './Footer'

const Layout = ({ children }) => {
    return (
        <>
            <Header/>

            <div className='fixed w-full flex bg-[url(/assets/images/bgDesktop.webp)] h-full bg-no-repeat bg-cover bg-center -z-10'>
                <div className='w-full bg-black bg-opacity-60'>
                </div>
            </div>

            {children}

            <Footer/>
        </>
    );
};

export default Layout;
