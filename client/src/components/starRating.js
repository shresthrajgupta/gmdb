import React, { useEffect, useState } from 'react';
import { FaStar } from 'react-icons/fa';
import axios from "axios";

const StarRating = ({ gameId }) => {
    const [hovered, setHovered] = useState(null);
    const [rating, setRating] = useState([0, 0, 0]);

    const fetchData = async () => {
        try {
            const ratingData = await axios.get(`/game/rating/${gameId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            setRating([ratingData.data.data.average, ratingData.data.data.user, ratingData.data.data.count]);
        } catch (err) {
            console.log("Rating Error", err);
        }
    };

    const changeRating = async (value) => {
        try {
            const response = await axios.post("/game/rating",
                { gameId, score: value },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            setRating((rating) => [rating[0], value, rating[2]]);

        } catch (error) {
            console.error("Failed to rate", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [gameId, rating[1]]
    )

    return (
        <>
            <div className="flex space-x- items-center">
                <strong>Your Rating: </strong>

                <div className='flex ml-2'>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                            key={star}
                            size={25}
                            className={`cursor-pointer transition-colors duration-200 ${(hovered || rating[1]) >= star ? "text-orange-500" : "text-gray-300"
                                }`}
                            onClick={() => changeRating(star)}
                            onMouseEnter={() => setHovered(star)}
                            onMouseLeave={() => setHovered(null)}
                        />
                    ))}
                </div>

                <p className='px-2'> {rating[0]}/5 ({rating[2]})</p>
            </div>
        </>
    );
};

export default StarRating;
