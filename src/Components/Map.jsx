import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./Map.css";
import L from "leaflet";

// Fix Leaflet marker icon issue in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function Map() {
  const [gvps, setGvps] = useState([]);
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [gvpRes, routeRes] = await Promise.all([
        axios.get("http://localhost:8000/gvps"),
        axios.get("http://localhost:8000/routes/all")
      ]);
      setGvps(gvpRes.data);
      setRoutes(routeRes.data);
    } catch (e) {
      console.error(e);
    }
  };

  // Assign colors to routes
  const colors = ["blue", "red", "green", "purple", "orange"];

  return (
    <>
      <div className="top-nav">
        <div className="container nav-right">
          <Link to="/" className="nav-link">Dashboard</Link>
          <Link to="/reports" className="nav-link">Reports</Link>
        </div>
      </div>

      <header className="main-header">
        <div className="container">
          <h1>GHMC GVP Monitoring</h1>
        </div>
      </header>

      <div className="map-page" style={{ height: "80vh", width: "100%" }}>
        <MapContainer center={[17.3850, 78.4867]} zoom={13} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {gvps.map((gvp) => (
            <Marker key={gvp.gvp_id} position={[gvp.latitude, gvp.longitude]}>
              <Popup>
                <b>{gvp.gvp_name}</b><br />
                Status: {gvp.status}<br />
                Est. Waste: {gvp.waste_estimated_tonnes}T
              </Popup>
            </Marker>
          ))}

          {routes.map((route, idx) => {
            // route.route i.e route_json is an array of objects {id, type, ...}
            // BUT we need lat/lng. My RoutePoint schema only had id/type.
            // I need to map IDs to coordinates?
            // Ah, the route json stored in DB does NOT currently have lat/lng?
            // "route": [{"type": "GVP", "id": "Name..."}]
            // I need to lookup coordinates from gvps list.

            // Reconstruct path
            const positions = route.route.map(pt => {
              if (pt.type === "GVP") {
                const found = gvps.find(g => g.gvp_name === pt.id); // Assuming ID is GVP name
                return found ? [found.latitude, found.longitude] : null;
              } else if (pt.type === "SCTP") {
                // For now hardcoded or found from SCTPs if I had them.
                // Ideally backend sends full route with coords.
                // If I don't have coords, I skip.
                return null;
              }
              return null;
            }).filter(p => p !== null);

            return (
              <Polyline key={route.route_id} positions={positions} color={colors[idx % colors.length]} />
            );
          })}
        </MapContainer>
      </div>
    </>
  );
}
