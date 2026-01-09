import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleMap, LoadScript, DirectionsService, DirectionsRenderer } from "@react-google-maps/api";
import axios from "axios";
import "./Dashboard.css";

const containerStyle = {
    width: '100%',
    height: '60vh'
};

const center = {
    lat: 17.3850,
    lng: 78.4867
};

const API_KEY = "AIzaSyC3k61RkhvQ69xMg6tA2eG0B2AWPBDw6Wo"; // User provided key

export default function RouteMap() {
    const navigate = useNavigate();
    const [mobile] = useState("9999999900");
    const [routePoints, setRoutePoints] = useState([]);
    const [nextGvp, setNextGvp] = useState(null);
    const [currentPos, setCurrentPos] = useState(null); // {lat, lng}
    const [directions, setDirections] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 1. Get Live Location and Watch
        let watchId;
        if (navigator.geolocation) {
            watchId = navigator.geolocation.watchPosition(
                (position) => {
                    const newPos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    setCurrentPos(newPos);
                },
                (err) => console.error(err),
                { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
            );
        } else {
            setCurrentPos(center);
        }

        // 2. Fetch Route Data
        fetchRouteAndGvps();

        return () => {
            if (watchId) navigator.geolocation.clearWatch(watchId);
        };
    }, []);

    const fetchRouteAndGvps = async () => {
        try {
            const [rRes, gRes] = await Promise.all([
                axios.get(`http://localhost:8000/driver/route/${mobile}`),
                axios.get("http://localhost:8000/gvps")
            ]);

            const points = rRes.data.points || [];
            setRoutePoints(points);

            // Find next pending GVP
            let foundNext = null;
            for (let pt of points) {
                if (pt.type === "GVP") {
                    const gvpDb = gRes.data.find(g => g.gvp_name === pt.id);
                    // Status must be PENDING. 
                    // If it is PARTIALLY_CLEARED, user wants to "mark status as cleared or partialy cleared"
                    // If it's already PARTIALLY_CLEARED, does it stay in queue? 
                    // User said: "once the gvp is reached... submit proof... mark status... then previous destination should be source and next gvp point in route must be fixed"
                    // This implies if we submit "Partial", we likely move on or stay?
                    // Usually "Partial" means we collected some, but maybe we move on.
                    // Let's assume PENDING only for "Next Destination" to ensure we move forward.
                    if (gvpDb && gvpDb.status === "PENDING") {
                        foundNext = gvpDb;
                        break;
                    }
                }
            }
            setNextGvp(foundNext);
            setLoading(false);
        } catch (e) {
            console.error(e);
            setLoading(false);
        }
    };

    const directionsCallback = useCallback((response) => {
        if (response !== null) {
            if (response.status === 'OK') {
                setDirections(response);
            } else {
                console.error('Directions request failed due to ' + response.status);
            }
        }
    }, []);

    if (loading) return <div>Loading Route...</div>;
    if (!nextGvp) return <div className="p-4">All GVPs Cleared! <button onClick={() => navigate("/")}>Home</button></div>;

    return (
        <div className="map-screen">
            <div className="map-header">
                <button onClick={() => navigate("/")}>Back</button>
                <h3>Navigating to: {nextGvp.gvp_name}</h3>
            </div>

            <LoadScript googleMapsApiKey={API_KEY}>
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={currentPos || center}
                    zoom={14}
                >
                    {/* Directions Service */}
                    {currentPos && nextGvp && (
                        <DirectionsService
                            options={{
                                destination: { lat: nextGvp.latitude, lng: nextGvp.longitude },
                                origin: currentPos,
                                travelMode: 'DRIVING',
                                provideRouteAlternatives: false,
                                drivingOptions: {
                                    departureTime: new Date(Date.now()), // For traffic estimation
                                    trafficModel: 'bestguess'
                                }
                            }}
                            callback={directionsCallback}
                        />
                    )}

                    {/* Render Route */}
                    {directions && (
                        <DirectionsRenderer
                            options={{
                                directions: directions
                            }}
                        />
                    )}
                </GoogleMap>
            </LoadScript>

            <div className="map-footer">
                <div className="info-row">
                    <span>Dest: {nextGvp.gvp_name}</span>
                    <span>Status: {nextGvp.status}</span>
                </div>
                <button className="primary-btn full" onClick={() => navigate("/proof", { state: { gvp: nextGvp } })}>
                    Arrived - Upload Proof
                </button>
            </div>
        </div>
    );
}
