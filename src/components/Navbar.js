import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const email = localStorage.getItem('email');

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">
                <Link className="navbar-brand fw-bold" to="/search">FlightPredictor AI</Link>
                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item"><Link className="nav-link" to="/search">Search</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/dashboard">Dashboard</Link></li>
                    </ul>
                    <span className="navbar-text me-3">User: {email}</span>
                    <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>Logout</button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;