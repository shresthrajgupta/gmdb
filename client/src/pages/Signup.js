import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import logo from "../assets/logo.png";


const SignUpForm = () => {
    const navigate = useNavigate();

    const [serverError, setServerError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        retypePassword: ''
    });
    const [errors, setErrors] = useState({
        name: '',
        email: '',
        password: '',
        retypePassword: ''
    });
    const [otpData, setOtpData] = useState({
        otp: ''
    });
    const [showOtp, setShowOtp] = useState(false);

    const validateForm = () => {
        const newErrors = {};
        const { name, email, password, retypePassword } = formData;

        if (!name || name.length < 8 || name.length > 15) newErrors.name = 'Name must be between 8 to 15 characters';
        if (!email || !/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Valid email is required';
        if (!password || password.length < 8 || password.length > 15) newErrors.password = 'Password must be between 8 to 15 characters';
        if (password !== retypePassword) newErrors.retypePassword = 'Passwords do not match';

        setErrors(newErrors);

        // console.log(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const validateOtp = () => {
        if (!otpData.otp || otpData?.otp?.length !== 6) {
            return 'OTP must be 6 digits';
        }
        return '';
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleOtpChange = (e) => {
        setOtpData({
            otp: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setServerError("");

        if (showOtp) {
            const otpError = validateOtp();
            if (otpError) {
                setServerError(otpError);
                return;
            }

            try {
                const response = await axios.post('/user/verify',
                    { otp: parseInt(otpData.otp) },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    }
                );

                if (response.status === 200) {
                    localStorage.removeItem('token');
                    navigate('/login');
                }
                else
                    setServerError('OTP mismatch');

            } catch (error) {
                // console.error('Error:', error);
                setServerError(error?.response?.data?.error || 'An error occurred, please try again.');
            }
        } else {
            if (validateForm()) {
                try {
                    const response = await axios.post('/user/register', {
                        name: formData.name,
                        email: formData.email,
                        password: formData.password
                    }, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });

                    // console.log("response", response);

                    if (response.status === 200) {
                        const token = response?.data?.data?.token;
                        if (token) {
                            localStorage.setItem('token', token);
                            setShowOtp(true);
                        }
                    } else
                        setServerError(response?.data?.message || 'An error occurred, please try again later.');

                } catch (error) {
                    // console.error('Error:', error);
                    setServerError(error?.response?.data?.error || 'An error occurred, please try again later.');
                }
            }
        }
    };

    useEffect(() => {
        localStorage.removeItem('token');
    }, []);

    return (
        <>
            <div className="flex flex-col items-center justify-center min-h-screen">
                <div className="flex flex-col items-center px-6">
                    <img src={logo} alt='Logo' className="w-32" />
                    <p className='text-xl md:text-2xl'>Level up your gaming with GMDB</p>
                    <p className='text-xl md:text-2xl'>Sign up and stay on top of the action!</p>
                </div>

                <div className="p-6 w-full max-w-sm">
                    <form onSubmit={handleSubmit} >
                        {showOtp && <h2 className="text-2xl font-bold mb-6 text-center"> Verify OTP</h2>}

                        {serverError && <p className="text-red-500 text-sm mb-4">{serverError}</p>}

                        {showOtp ?

                            (
                                <>
                                    <div className="mb-4">
                                        <label htmlFor="otp" className="block text-gray-700 dark:text-gray-300">Enter OTP:</label>
                                        <input
                                            type="text"
                                            id="otp"
                                            name="otp"
                                            value={otpData.otp}
                                            onChange={handleOtpChange}
                                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none ${serverError ? 'border-red-500' : 'border-gray-300'} bg-neutral-900`}
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                                    >
                                        Verify OTP
                                    </button>
                                </>
                            )



                            :

                            (
                                <>
                                    <div className="mb-4">
                                        <label htmlFor="name" className="block">Name:</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none ${errors.name ? 'border-red-500' : 'border-white'} focus:border-blue-500 bg-neutral-900`}
                                            placeholder="Shresth Gupta"
                                            required
                                        />
                                        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="email" className="block">Email:</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none ${errors.email ? 'border-red-500' : 'border-white'} focus:border-blue-500 bg-neutral-900`}
                                            placeholder="xyz@email.com"
                                            required
                                        />
                                        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="password" className="block">Password:</label>
                                        <input
                                            type="password"
                                            id="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none ${errors.password ? 'border-red-500' : 'border-white'} focus:border-blue-500 bg-neutral-900`}
                                            placeholder="p@sswOrd"
                                            required
                                        />
                                        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="retypePassword" className="block">Retype Password:</label>
                                        <input
                                            type="password"
                                            id="retypePassword"
                                            name="retypePassword"
                                            value={formData.retypePassword}
                                            onChange={handleChange}
                                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none ${errors.retypePassword ? 'border-red-500' : 'border-white'} focus:border-blue-500 bg-neutral-900`}
                                            placeholder="p@sswOrd"
                                            required
                                        />
                                        {errors.retypePassword && <p className="text-red-500 text-sm">{errors.retypePassword}</p>}
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                                    >
                                        Sign Up
                                    </button>
                                </>
                            )

                        }


                    </form>
                </div>

                <div>
                    <Link to="/login" className='hover:text-white'> Already have an account? </Link>
                </div>
            </div>
        </>
    );
};

export default SignUpForm;
