import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/users/login/', { email, password });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('email', email); // For the Navbar
            navigate('/search');
        } catch (err) {
            alert('Login Failed: Check your credentials or server status.');
        }
    };

    return (
        <div className="container mt-5">
            <div className="card col-md-5 mx-auto p-4 shadow">
                <h3 className="text-center">Flight Predictor Login</h3>
                <form onSubmit={handleLogin} className="mt-3">
                    <input type="email" placeholder="Email" className="form-control mb-3" onChange={e => setEmail(e.target.value)} required />
                    <input type="password" placeholder="Password" className="form-control mb-3" onChange={e => setPassword(e.target.value)} required />
                    <button type="submit" className="btn btn-primary w-100">Sign In</button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;