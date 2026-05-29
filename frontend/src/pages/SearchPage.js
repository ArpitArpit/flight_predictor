import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import PredictionCard from '../components/PredictionCard';

const SearchPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        flight_number: '',
        Airline: '',
        AirportFrom: '',
        AirportTo: '',
        DayOfWeek: 5,
        Time: 700,
        Length: 300,
    });
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);
    const [subscribing, setSubscribing] = useState(false);
    const [error, setError] = useState('');

    const updateField = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const buildPayload = () => ({
        flight_number: formData.flight_number.trim(),
        Airline: formData.Airline.trim().toUpperCase(),
        AirportFrom: formData.AirportFrom.trim().toUpperCase(),
        AirportTo: formData.AirportTo.trim().toUpperCase(),
        DayOfWeek: Number(formData.DayOfWeek),
        Time: Number(formData.Time),
        Length: Number(formData.Length),
    });

    const getPrediction = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setPrediction(null);
        try {
            const res = await api.post('/predict/', buildPayload());
            setPrediction(res.data);
        } catch (err) {
            const msg = err.response?.data
                ? JSON.stringify(err.response.data)
                : 'Could not reach the server. Is Django running on port 8000?';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleSubscribe = async () => {
        const payload = buildPayload();
        setSubscribing(true);
        setError('');
        try {
            const scheduled = new Date();
            scheduled.setDate(scheduled.getDate() + ((payload.DayOfWeek - scheduled.getDay() + 7) % 7));
            const hours = Math.floor(payload.Time / 100);
            const minutes = payload.Time % 100;
            scheduled.setHours(hours, minutes, 0, 0);

            const flightRes = await api.post('/flights/', {
                flight_number: payload.flight_number,
                origin_airport: payload.AirportFrom,
                destination_airport: payload.AirportTo,
                scheduled_departure: scheduled.toISOString(),
                last_base_prediction: prediction?.base_probability ?? null,
                last_final_prediction: prediction?.final_delay_risk ?? null,
            });

            await api.post('/subscriptions/', { flight: flightRes.data.id });
            navigate('/dashboard');
        } catch (err) {
            const msg = err.response?.data
                ? JSON.stringify(err.response.data)
                : 'Subscribe failed.';
            setError(msg);
        } finally {
            setSubscribing(false);
        }
    };

    return (
        <div className="container">
            <h2 className="mb-4">Analyze Delay Risk</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={getPrediction} className="card p-4 shadow-sm mb-4">
                <div className="row g-3">
                    <div className="col-md-4">
                        <label className="form-label">Flight number</label>
                        <input
                            placeholder="UA 137"
                            className="form-control"
                            value={formData.flight_number}
                            required
                            onChange={(e) => updateField('flight_number', e.target.value)}
                        />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label">Airline code</label>
                        <input
                            placeholder="UA"
                            className="form-control"
                            value={formData.Airline}
                            required
                            maxLength={3}
                            onChange={(e) => updateField('Airline', e.target.value)}
                        />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label">Day of week</label>
                        <select
                            className="form-select"
                            value={formData.DayOfWeek}
                            onChange={(e) => updateField('DayOfWeek', e.target.value)}
                        >
                            <option value={1}>Monday</option>
                            <option value={2}>Tuesday</option>
                            <option value={3}>Wednesday</option>
                            <option value={4}>Thursday</option>
                            <option value={5}>Friday</option>
                            <option value={6}>Saturday</option>
                            <option value={7}>Sunday</option>
                        </select>
                    </div>
                    <div className="col-md-4">
                        <label className="form-label">Origin (IATA)</label>
                        <input
                            placeholder="JFK"
                            className="form-control"
                            value={formData.AirportFrom}
                            required
                            maxLength={10}
                            onChange={(e) => updateField('AirportFrom', e.target.value)}
                        />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label">Destination (IATA)</label>
                        <input
                            placeholder="LAX"
                            className="form-control"
                            value={formData.AirportTo}
                            required
                            maxLength={10}
                            onChange={(e) => updateField('AirportTo', e.target.value)}
                        />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label">Departure time (HHMM)</label>
                        <input
                            type="number"
                            className="form-control"
                            value={formData.Time}
                            min={0}
                            max={2359}
                            required
                            onChange={(e) => updateField('Time', e.target.value)}
                        />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label">Flight length (minutes)</label>
                        <input
                            type="number"
                            className="form-control"
                            value={formData.Length}
                            min={30}
                            max={1200}
                            required
                            onChange={(e) => updateField('Length', e.target.value)}
                        />
                    </div>
                    <div className="col-md-8 d-flex align-items-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary w-100"
                        >
                            {loading ? 'Loading model & predicting…' : 'Calculate risk'}
                        </button>
                    </div>
                </div>
            </form>
            {prediction && (
                <>
                    <PredictionCard data={prediction} />
                    <button
                        type="button"
                        className="btn btn-outline-primary mt-3"
                        disabled={subscribing}
                        onClick={handleSubscribe}
                    >
                        {subscribing ? 'Subscribing…' : 'Subscribe to alerts'}
                    </button>
                </>
            )}
        </div>
    );
};

export default SearchPage;
