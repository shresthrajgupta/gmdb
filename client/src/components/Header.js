import React, { useEffect, useState } from 'react';
import { NavLink, Link, useNavigate } from "react-router-dom";
import axios from 'axios';

import logo from "../assets/logo.png";
import userIcon from "../assets/user.png";
import { navigation } from '../constants/navigation';

import { IoSearchOutline } from "react-icons/io5";


const Header = () => {
    const navigate = useNavigate();

    const [searchInput, setSearchInput] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [loadingSearch, setLoadingSearch] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (searchInput === "")
            navigate("/home");
        else
            navigate(`/search?q=${searchInput}`);

        setSearchInput("");
    };


    useEffect(() => {
        const delayBounce = setTimeout(async () => {
            const value = searchInput

            // console.log(value);

            if (value) {
                setLoadingSearch(true);


                try {
                    const response = await axios.get(`game/search?q=${value}`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    });

                    // console.log(response.data.data);
                    setSearchResults(response.data.data);
                } catch (error) {
                    console.error('Error fetching search results:', error);
                }
                setLoadingSearch(false);
            } else {
                setSearchResults([]);
            }


        }, 100);

        return () => clearTimeout(delayBounce);
    }, [searchInput]);

    return (
        <header className='fixed top-0 w-full h-16 bg-black bg-opacity-60 z-40 backdrop-blur-sm'>
            <div className='container mx-auto px-3 flex items-center h-full'>
                <Link to={"/home"}>
                    <img src={logo} alt='logo' width={70} />
                </Link>

                <nav className='hidden lg:flex items-center gap-1 ml-5'>
                    {navigation.map((nav, index) => {
                        return (
                            <div key={index}>
                                <NavLink
                                    key={nav.label}
                                    to={nav.href}
                                    className={({ isActive }) => `px-2 hover:text-white ${isActive && "text-white"}`}
                                >
                                    {nav.label}
                                </NavLink>
                            </div>
                        )
                    })}
                </nav>

                <div className='ml-auto flex items-center gap-5'>
                    <div className='relative'>
                        <form className='flex items-center gap-2' onSubmit={handleSubmit}>
                            <input
                                type='text'
                                placeholder='Search game'
                                className='bg-transparent px-4 py-1 outline-none border-none'
                                onChange={(e) => { setSearchInput(e.target.value) }}
                                value={searchInput}
                            />
                            <button className='text-2xl text-white'>
                                <IoSearchOutline />
                            </button>
                        </form>

                        {
                            searchInput.length > 0 &&
                            <ul className='absolute w-full bg-opacity-90 rounded-lg mt-2 bg-neutral-800'>
                                {loadingSearch
                                    ?
                                    <li className='px-4 py-2'>Loading...</li>
                                    :
                                    searchResults.map((result) => (
                                        <li
                                            key={result.id}
                                            className='px-4 py-2 hover:bg-neutral-600 cursor-pointer rounded'
                                        // onClick={() => handleResultClick(result)}
                                        >
                                            <Link to={result.url} onClick={() => setSearchInput("")} >{result.name}</Link>
                                        </li>
                                    ))
                                }
                            </ul>
                        }
                    </div>

                    <div className='w-8 h-8 rounded-full overflow-hidden cursor-pointer active:scale-90 transition-all'>
                        <img src={userIcon} alt='user' />
                    </div>
                </div>
            </div>

        </header>
    )
}

export default Header