import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from "axios";
import moment from "moment";

import Unauthorized from "./Unauthorized";
import Loading from '../components/Loading';
import Divider from '../components/Divider';

import gameCover from "../assets/game_cover.webp";

const Franchise = () => {
    const params = useParams();

    const [data, setData] = useState({});
    const [isUnauthorized, setIsUnauthorized] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            setLoading(true);
            const guid = params.id;

            const response = await axios.get(`/franchise/guid/${guid}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            setData(response?.data?.data);

        } catch (err) {
            if (err?.response?.status === 401)
                setIsUnauthorized(true);

            console.log("Game Detail Error", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [params.id])


    return (
        isUnauthorized ? <Unauthorized /> : (
            loading ? <Loading /> :
                <div>

                    <div className='w-full h-[280px] relative hidden lg:block'>
                        <div className='w-full h-full'>
                            <img src={gameCover} alt='game_cover' className='h-full w-full object-cover' />
                        </div>

                        <div className='absolute w-full h-full top-0 bg-gradient-to-t from-neutral-900 to-transparent'></div>
                    </div>

                    <div className='container mx-auto px-3 py-2 lg:py-0 flex flex-col lg:flex-row gap-5 lg:gap-10'>
                        <div>
                            <h2 className='text-2xl lg:text-4xl my-2 font-bold text-white'> {data.name} </h2>
                            <p className='text-neutral-400'> {data.deck} </p>

                            <Divider />
                        </div>
                    </div>

                    <div>
                        {
                            data?.games?.length > 0 &&
                            <div className='container mx-auto px-3 my-10'>
                                <h2 className='text-xl lg:text-2xl font-bold mb-5' >This franchise has following series of games: </h2>

                                <div className='relative'>
                                    <div className='grid grid-cols-2 lg:grid-cols-4 gap-6 relative z-10'>
                                        {
                                            data?.games?.map((game, index) => {
                                                return (
                                                    <Link to={game?.url} key={index} className='w-full overflow-hidden block rounded relative hover:scale-105 transition-all'>
                                                        <h4 className='text-ellipsis line-clamp-1 text-md font-semibold'>{game?.name}</h4>
                                                    </Link>
                                                );
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                        }
                    </div>

                    <div>
                        <div className='container mx-auto px-3 my-5'>
                            <p>Last updated at {moment(data?.updatedAt).format("Do MMMM YYYY")}</p>
                        </div>
                    </div>
                </div>
        )
    )
}

export default Franchise;