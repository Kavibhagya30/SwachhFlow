import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Dashboard.css"; // Reuse existing styles or create new
import { Truck, MapPin, AlertTriangle } from "lucide-react";

export default function Home() {
    const navigate = useNavigate();
    const [mobile] = useState("9999999900"); // Hardcoded for demo
    const [driverData, setDriverData] = useState(null);
    const [route, setRoute] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // Fetch Route
            const routeRes = await axios.get(`http://localhost:8000/driver/route/${mobile}`);
            setRoute(routeRes.data.points || []);

            // Fetch Driver Info (Mocking penalty points for now or need endpoint)
            // Ideally we have GET /user/{mobile}
            setDriverData({
                truckId: routeRes.data.route_id ? `T${routeRes.data.route_id}` : "T-NA",
                penaltyPoints: 0, // Default
                totalTime: "5h 30m" // Mock or calc from points
            });
        } catch (e) {
            console.error(e);
        }
    };

    const gvpCount = route.filter(p => p.type === "GVP").length;

    return (
        <div className="driver-app">
            <header className="app-header">
                <h1>SwachhFlow Driver</h1>
            </header>

            <div className="stats-card">
                <div className="stat">
                    <span className="label">Truck ID</span>
                    <span className="value">{driverData?.truckId || "--"}</span>
                </div>
                <div className="stat">
                    <span className="label">Penalty Points</span>
                    <span className="value red">{driverData?.penaltyPoints || 0}</span>
                </div>
            </div>

            <div className="route-summary">
                <h2>Today's Route</h2>
                <div className="summary-row">
                    <MapPin size={20} />
                    <span>{gvpCount} GVPs to clear</span>
                </div>
                <div className="summary-row">
                    <Truck size={20} />
                    <span>Est. Time: {driverData?.totalTime || "--"}</span>
                </div>
            </div>

            <div className="action-grid">
                <button className="primary-btn big" onClick={() => navigate("/map")}>
                    <MapPin size={24} />
                    Start / Resume Route
                </button>

                <button className="warning-btn" onClick={() => navigate("/alerts")}>
                    <AlertTriangle size={24} />
                    Report Issue
                </button>
            </div>
        </div>
    );
}
