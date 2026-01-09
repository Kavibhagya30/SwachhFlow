import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Dashboard.css";

export default function Alerts() {
    const navigate = useNavigate();
    const [alertType, setAlertType] = useState("TRAFFIC");
    const [details, setDetails] = useState("");
    const [trafficDelay, setTrafficDelay] = useState("15-30 mins");

    const handleSubmit = async () => {
        try {
            const payload = {
                truck_id: "T1", // Should fetch from context
                alert_type: alertType,
                details: alertType === "TRAFFIC" ? `Delay: ${trafficDelay}` : details
            };
            await axios.post("http://localhost:8000/alerts", payload);
            alert("Alert Sent!");
            navigate("/");
        } catch (e) {
            console.error(e);
            alert("Failed to send alert");
        }
    };

    return (
        <div className="alerts-screen p-4">
            <h2>Report Issue</h2>

            <div className="form-group">
                <label>Issue Type</label>
                <select value={alertType} onChange={e => setAlertType(e.target.value)}>
                    <option value="TRAFFIC">Heavy Traffic</option>
                    <option value="FUEL_LOW">Fuel Insufficient</option>
                    <option value="TRUCK_FAILURE">Truck Breakdown</option>
                </select>
            </div>

            {alertType === "TRAFFIC" && (
                <div className="form-group">
                    <label>Expected Delay</label>
                    <select value={trafficDelay} onChange={e => setTrafficDelay(e.target.value)}>
                        <option value="15-30 mins">15-30 mins</option>
                        <option value="30-45 mins">30-45 mins</option>
                        <option value="> 1 hour">More than 1 hour</option>
                    </select>
                </div>
            )}

            {alertType !== "TRAFFIC" && (
                <div className="form-group">
                    <label>Details</label>
                    <textarea value={details} onChange={e => setDetails(e.target.value)} placeholder="Describe the issue..." />
                </div>
            )}

            <button className="warning-btn full" onClick={handleSubmit}>Send Alert</button>
            <button className="text-btn" onClick={() => navigate("/")}>Cancel</button>

        </div>
    );
}
