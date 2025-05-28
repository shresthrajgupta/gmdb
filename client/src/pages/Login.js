import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from "../assets/logo.png";

const Login = () => {
  const navigate = useNavigate();

  const [serverError, setServerError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const validateForm = () => {
    const newErrors = {};
    const { email, password } = formData;

    if (!email || !/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid Email or Password';
    if (!password || password.length < 8 || password.length > 15) newErrors.password = 'Invalid Email or Password';

    // console.log(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setServerError("");

    if (validateForm()) {
      try {
        const response = await axios.post('/user/login', {
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
            navigate('/home');
          }
        } else
          setServerError(response?.data?.message || 'An error occurred, please try again later.');

      } catch (error) {
        // console.error('Error:', error);
        setServerError(error?.response?.data?.error || 'An error occurred, please try again later.');
      }
    }
    else
      setServerError("Invalid Email or Password");
  }

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/home');
    }
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="flex flex-col items-center px-6">
        <img src={logo} alt='Logo' className="w-32" />
        <p className='text-xl md:text-2xl'>Log in to GMDB</p>
      </div>

      <div className="p-6 w-full max-w-sm">
        <form onSubmit={handleSubmit}>
          {serverError && <p className="text-red-500 text-sm mb-4">{serverError}</p>}
          <div className="mb-4">
            <label htmlFor="email" className="block">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none ${serverError ? 'border-red-500' : 'border-white'} focus:border-blue-500 bg-neutral-900`}
              placeholder="xyz@email.com"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none ${serverError ? 'border-red-500' : 'border-white'} focus:border-blue-500 bg-neutral-900`}
              placeholder="p@sswOrd"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
          >
            Log In
          </button>
        </form>

      </div>

      <div>
        <Link to="/forgot_password" className='hover:text-white'> Forgot Password? </Link>
      </div>
      <div>
        <Link to="/signup" className='hover:text-white'> Don't have an account? </Link>
      </div>

    </div>
  )
}

export default Login