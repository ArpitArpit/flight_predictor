import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isRegister, setIsRegister] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            await api.post('/users/register/', { email, password });
            setMessage('Account created. You can sign in now.');
            setIsRegister(false);
        } catch (err) {
            setMessage(err.response?.data ? JSON.stringify(err.response.data) : 'Registration failed.');
        }
    };

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
                <h3 className="text-center">{isRegister ? 'Create account' : 'Flight Predictor Login'}</h3>
                {message && <p className="text-muted small mt-2">{message}</p>}
                <form onSubmit={isRegister ? handleRegister : handleLogin} className="mt-3">
                    <input type="email" placeholder="Email" className="form-control mb-3" value={email} onChange={e => setEmail(e.target.value)} required />
                    <input type="password" placeholder="Password" className="form-control mb-3" value={password} onChange={e => setPassword(e.target.value)} required />
                    <button type="submit" className="btn btn-primary w-100">{isRegister ? 'Register' : 'Sign In'}</button>
                </form>
                <button type="button" className="btn btn-link w-100 mt-2" onClick={() => { setIsRegister(!isRegister); setMessage(''); }}>
                    {isRegister ? 'Already have an account? Sign in' : 'New user? Register'}
                </button>
            </div>
        </div>
    );
};

export default LoginPage;