import React, { useState } from 'react';
import api from '../api';
import PredictionCard from '../components/PredictionCard';

const SearchPage = () => {
    const [formData, setFormData] = useState({
        flight_number: '', Airline: '', AirportFrom: '', AirportTo: '',
        DayOfWeek: 1, Time: 720, Length: 120
    });
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);

    const getPrediction = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/predict/', formData);
            setPrediction(res.data);
        } catch (err) {
            alert("Error fetching prediction. Is the backend running?");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <h2 className="mb-4">Analyze Delay Risk</h2>
            <form onSubmit={getPrediction} className="card p-4 shadow-sm mb-4">
                <div className="row g-3">
                    <div className="col-md-4"><input placeholder="Flight No (e.g. UA 137)" className="form-control" required onChange={e => setFormData({...formData, flight_number: e.target.value})} /></div>
                    <div className="col-md-4"><input placeholder="Airline Code (e.g. UA)" className="form-control" required onChange={e => setFormData({...formData, Airline: e.target.value})} /></div>
                    <div className="col-md-4"><button disabled={loading} className="btn btn-primary w-100">{loading ? 'Processing...' : 'Calculate Risk'}</button></div>
                </div>
            </form>
            {prediction && <PredictionCard data={prediction} />}
        </div>
    );
};

export default SearchPage;