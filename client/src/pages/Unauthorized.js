import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-neutral-900 text-white">
            <div className="text-center">
                <p className="text-2xl mb-8">Session expired, Please re-login</p>
                <Link to="/login" className="text-blue-500 hover:text-blue-400">
                    Go To Login Page
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
