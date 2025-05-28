import React, { useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";
import axios from "axios";
import Card from '../components/Card';
import Unauthorized from "./Unauthorized";

import { BeatLoader } from "react-spinners";

const Explore = () => {
    const location = useLocation();

    const [pageNo, setPageNo] = useState(1);
    const [data, setData] = useState([]);
    const [totalPage, setTotalPage] = useState(0);
    const [isUnauthorized, setIsUnauthorized] = useState(false);
    const [loading, setLoading] = useState(true);
    const [shouldFetch, setShouldFetch] = useState(false);

    // const field = location.pathname.slice(1) === "playlist" ? "toPlay" : "finished";

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/game/${location.pathname.slice(1)}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                params: { page: pageNo }
            });

            // console.log(response.data.data);

            setData((prev) => {
                const toPlay = response?.data?.data?.toPlay || [];
                const finished = response?.data?.data?.finished || [];

                const final = toPlay.length === 0 ? finished : toPlay;
                return [...prev, ...final];
            });
            setTotalPage(response.data.data.totalPages);

            // console.log(response.data.data.totalPages);

        } catch (err) {
            if (err?.response?.status === 401)
                setIsUnauthorized(true);

            console.log("Explore Error", err);
        } finally {
            setLoading(false);
        }
    };

    const handleScroll = () => {
        const buffer = 10;
        if ((window.innerHeight + window.scrollY + buffer) >= document.body.offsetHeight) {
            setPageNo(prev => prev + 1);
            // console.log(pageNo);
        }
    };

    // useEffect(() => {
    //     window.addEventListener("scroll", handleScroll);
    //     return () => window.removeEventListener("scroll", handleScroll);
    // }, []);

    // useEffect(() => {
    //     fetchData();
    // }, [pageNo, location?.pathname]);

    // useEffect(() => {
    //     setPageNo(1);
    //     setData([]);
    // }, [location?.pathname]);

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (shouldFetch) {
            fetchData();
            setShouldFetch(false);
        }
    }, [shouldFetch]);

    useEffect(() => {
        setPageNo(1);
        setData([]);
        setShouldFetch(true);
    }, [location?.pathname]);

    useEffect(() => {
        if (pageNo > 1) {
            setShouldFetch(true);
        }
    }, [pageNo]);

    return (
        isUnauthorized ? <Unauthorized /> :
            <div className='py-16'>
                <div className='container mx-auto'>
                    <h3 className='text-lg lg:text-3xl font-semibold my-5 px-5'>Your {location.pathname.slice(1) === "playlist" ? "Playlist" : "Completed List"}</h3>

                    <div className='grid grid-cols-[repeat(auto-fit,230px)] gap-6 justify-center lg:justify-start'>
                        {
                            data.map((exploreData, index) => {
                                return (
                                    <Card data={exploreData} key={exploreData.id + index} />
                                )
                            })
                        }
                    </div>

                </div>

                {
                    pageNo <= totalPage + 1 ?
                        loading &&
                        <div className='flex justify-center items-center mt-16'>
                            <BeatLoader color="#ffffff" size={15} />
                        </div>
                        : <div></div>
                }


            </div>
    )
}

export default Explore