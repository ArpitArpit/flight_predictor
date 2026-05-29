import React, { useEffect, useState } from 'react';
import api from '../api';

const Dashboard = () => {
    const [subscriptions, setSubscriptions] = useState([]);

    useEffect(() => {
        const fetchSubscriptions = async () => {
            try {
                // Calls the GET /api/subscriptions/ endpoint
                const response = await api.get('/subscriptions/');
                setSubscriptions(response.data);
            } catch (err) {
                console.error("Failed to fetch subscriptions");
            }
        };
        fetchSubscriptions();
    }, []);

    const handleUnsubscribe = async (id) => {
        try {
            await api.delete(`/subscriptions/${id}/`);
            setSubscriptions(subscriptions.filter(sub => sub.id !== id));
        } catch (err) {
            alert("Unsubscribe failed");
        }
    };

    return (
        <div className="container">
            <h3>My Flight Subscriptions</h3>
            <p className="text-muted">Threshold: 15% risk change triggers an email alert.</p>
            <table className="table table-hover mt-3">
                <thead className="table-light">
                    <tr>
                        <th>Flight #</th>
                        <th>Base Risk</th>
                        <th>Final Risk</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {subscriptions.length === 0 && (
                        <tr>
                            <td colSpan={5} className="text-muted text-center py-4">
                                No subscriptions yet. Run a prediction on Search and click Subscribe.
                            </td>
                        </tr>
                    )}
                    {subscriptions.map(sub => (
                        <tr key={sub.id}>
                            <td>{sub.flight_details.flight_number}</td>
                            <td>{(sub.flight_details.last_base_prediction * 100).toFixed(1)}%</td>
                            <td className="fw-bold">{(sub.flight_details.last_final_prediction * 100).toFixed(1)}%</td>
                            <td>
                                <span className={`badge ${sub.flight_details.propagating_status === 'Delayed' ? 'bg-danger' : 'bg-success'}`}>
                                    {sub.flight_details.propagating_status}
                                </span>
                            </td>
                            <td>
                                <button className="btn btn-sm btn-danger" onClick={() => handleUnsubscribe(sub.id)}>Unsubscribe</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Dashboard;