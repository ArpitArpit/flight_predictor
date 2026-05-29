const PredictionCard = ({ data }) => (
    <div className={`card p-3 ${data.propagating_status === 'Delayed' ? 'border-danger' : 'border-success'}`}>
        <h5>Flight: {data.flight_number}</h5>
        <p>Base ML Prediction: {(data.base_probability * 100).toFixed(1)}%</p>
        <h4 className="text-primary">Final Delay Risk: {(data.final_delay_risk * 100).toFixed(1)}%</h4>
        <p>Status: <strong>{data.propagating_status}</strong></p>
    </div>
);

export default PredictionCard;