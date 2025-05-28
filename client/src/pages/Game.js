import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from "axios";
import moment from "moment";

import Unauthorized from "./Unauthorized";
import Loading from '../components/Loading';
import Divider from '../components/Divider';

import gameCover from "../assets/game_cover.jpg";

const Game = () => {
    const params = useParams();

    const [data, setData] = useState({});
    const [playing, setPlaying] = useState(false);
    const [completed, setCompleted] = useState(false);
    const [isUnauthorized, setIsUnauthorized] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            setLoading(true);
            const guid = params.id;

            const response = await axios.get(`/game/guid/${guid}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            setData(response?.data?.data);
            setPlaying(response?.data?.data?.isPlaying);
            setCompleted(response?.data?.data?.isCompleted);

        } catch (err) {
            if (err?.response?.status === 401)
                setIsUnauthorized(true);

            console.log("Game Detail Error", err);
        } finally {
            setLoading(false);
        }
    };

    const changePlaylist = async () => {
        try {
            if (!playing) {
                const response = await axios.post("/game/playlist",
                    { gameId: data._id },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    }
                );

                if (response.status === 200) {
                    setPlaying(true);
                    setCompleted(false);
                }

            }
            else {
                const response = await axios.delete("/game/playlist", {
                    data: { gameId: data._id },
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
                );

                if (response.status === 200) {
                    setPlaying(false);
                    setCompleted(false);
                }
            }
        } catch (err) {
            console.log("List error", err);
        }
    };

    const changeCompletedlist = async () => {
        try {
            if (!completed) {
                const response = await axios.post("/game/completedlist",
                    { gameId: data._id },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    }
                );

                if (response.status === 200) {
                    setPlaying(false);
                    setCompleted(true);
                }

            }
            else {
                const response = await axios.delete("/game/completedlist", {
                    data: { gameId: data._id },
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
                );

                if (response.status === 200) {
                    setPlaying(false);
                    setCompleted(false);
                }
            }
        } catch (err) {
            console.log("List error", err);
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
                        <div className='relative mx-auto lg:-mt-28 lg:mx-0 w-fit min-w-60 mt-20'>
                            <img src={data.poster} alt='poster' className='h-80 w-60 object-cover rounded' />
                            <button onClick={changePlaylist} className={`mt-4 w-full py-2 text-center text-black rounded font-bold text-lg ${playing ? "bg-gradient-to-l from-red-500 to-orange-500" : "bg-white"} hover:scale-105 transition-all`}> Playlist </button>
                            <button onClick={changeCompletedlist} className={`mt-4 w-full py-2 text-center text-black rounded font-bold text-lg ${completed ? "bg-gradient-to-l from-red-500 to-orange-500" : "bg-white"} hover:scale-105 transition-all`}> Completed </button>
                        </div>

                        <div>
                            <h2 className='text-2xl lg:text-4xl my-2 font-bold text-white'> {data.name} </h2>
                            <p className='text-neutral-400'> {data.deck} </p>

                            <Divider />

                            <div>
                                {
                                    data?.original_game_rating?.length > 0 && (
                                        <p>
                                            <strong>Ratings: </strong>
                                            {data?.original_game_rating?.map((rating, index) => (
                                                <span key={index}>{rating}{index < data?.original_game_rating?.length - 1 ? ' | ' : ''}</span>
                                            ))}
                                            <Divider />
                                        </p>
                                    )
                                }
                            </div>

                            <div>
                                {
                                    data?.platforms?.length > 0 &&
                                    <p>
                                        <strong>Platforms: </strong>
                                        {data?.platforms?.map((platform, index) => (
                                            <span key={index}>{platform}{index < data?.platforms?.length - 1 ? ' | ' : ''}</span>
                                        ))}
                                        <Divider />
                                    </p>
                                }
                            </div>

                            <div>
                                {
                                    (data.expected_release_day || data.expected_release_month || data.expected_release_year) &&
                                    (
                                        <p>
                                            <strong>Expected Release: </strong>
                                            {
                                                (data?.expected_release_day || "") + " "
                                                + (data?.expected_release_month !== null ? moment().month(data?.expected_release_month - 1).format('MMMM') : "") + " "
                                                + data?.expected_release_year
                                            }
                                            <Divider />
                                        </p>
                                    )
                                }

                                {
                                    data?.original_release_date &&
                                    <>
                                        <p> <strong>Release Date: </strong> {moment(data?.original_release_date).format("Do MMMM YYYY")}</p>
                                        <Divider />
                                    </>
                                }
                            </div>


                            <div>
                                {
                                    data?.developers?.length > 0 &&
                                    <p>
                                        <strong>Developers: </strong>
                                        {data?.developers?.map((dev, index) => (
                                            <span key={index}>{dev}{index < data?.developers?.length - 1 ? ' | ' : ''}</span>
                                        ))}
                                        <Divider />
                                    </p>
                                }

                                {
                                    data?.publishers?.length > 0 &&
                                    <p>
                                        <strong>Publishers: </strong>
                                        {data?.publishers?.map((publisher, index) => (
                                            <span key={index}>{publisher}{index < data?.publishers?.length - 1 ? ' | ' : ''}</span>
                                        ))}
                                        <Divider />
                                    </p>
                                }

                                {
                                    data?.dlcs?.length > 0 &&
                                    <p>
                                        <strong>DLCs: </strong>
                                        {data?.dlcs?.map((dlc, index) => (
                                            <span key={index}>{dlc}{index < data?.dlcs?.length - 1 ? ' | ' : ''}</span>
                                        ))}
                                        <Divider />
                                    </p>
                                }

                                {
                                    data?.genres?.length > 0 &&
                                    <p>
                                        <strong>Genres: </strong>
                                        {data?.genres?.map((genre, index) => (
                                            <span key={index}>{genre}{index < data?.genres?.length - 1 ? ' | ' : ''}</span>
                                        ))}
                                        <Divider />
                                    </p>
                                }

                                {
                                    data?.themes?.length > 0 &&
                                    <p>
                                        <strong>Themes: </strong>
                                        {data?.themes?.map((theme, index) => (
                                            <span key={index}>{theme}{index < data?.themes?.length - 1 ? ' | ' : ''}</span>
                                        ))}
                                        <Divider />
                                    </p>
                                }
                            </div>
                        </div>
                    </div>

                    <div>
                        {
                            data?.franchises?.length > 0 &&
                            <div className='container mx-auto px-3 my-10'>
                                <h2 className='text-xl lg:text-2xl font-bold mb-5' >This game is part of the franchise</h2>

                                <div className='relative'>
                                    <div className='grid grid-cols-2 lg:grid-cols-5 gap-6 relative z-10'>
                                        {
                                            data?.franchises?.map((franchise, index) => {
                                                return (
                                                    <Link to={franchise.url} key={index} className='w-full overflow-hidden block rounded relative hover:scale-105 transition-all'>
                                                        <h4 className='text-ellipsis line-clamp-1 text-md font-semibold'>{franchise.name}</h4>
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
                        {
                            data?.similar_games?.length > 0 &&
                            <div className='container mx-auto px-3 my-10'>
                                <h2 className='text-xl lg:text-2xl font-bold mb-5' >Similar Games</h2>

                                <div className='relative'>
                                    <div className='grid grid-cols-2 lg:grid-cols-5 gap-6 relative z-10'>
                                        {
                                            data?.similar_games?.map((game, index) => {
                                                return (
                                                    <Link to={game.url} key={index} className='w-full overflow-hidden block rounded relative hover:scale-105 transition-all'>
                                                        <h4 className='text-ellipsis line-clamp-1 text-md font-semibold'>{game.name}</h4>
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

                </div >
        )
    )
}

export default Game;