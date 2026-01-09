import { useNavigate, useLocation } from "react-router-dom";
import { useState, useRef, useMemo } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./Service.css";
import "./Location.css";

// Fix icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function MapEvents({ setPos }) {
  useMapEvents({
    click(e) {
      setPos(e.latlng);
    },
  });
  return null;
}

export default function Locations() {
  const navigate = useNavigate();
  const location = useLocation();
  const mobile = location.state?.mobile || "9876543210";

  const [position, setPosition] = useState({ lat: 17.3850, lng: 78.4867 }); // Hyd default
  const [address, setAddress] = useState("");
  const markerRef = useRef(null);

  // Drag handler
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const { lat, lng } = marker.getLatLng();
          setPosition({ lat, lng });
          // Reverse geocoding can be added here if needed
          setAddress(`Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`);
        }
      },
    }),
    [],
  );

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition({ lat: latitude, lng: longitude });
          setAddress(`Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`);
        },
        (err) => alert("Could not fetch location")
      );
    }
  };

  const handleSubmit = () => {
    // Pass the selected lat/lng to next screen
    navigate("/gvp-points", {
      state: {
        address: address || "Pinned Location",
        lat: position.lat,
        lng: position.lng
      }
    });
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="top-nav">
          <span className="menu-icon" onClick={() => navigate(-1)}>←</span>
          <span className="nav-title">GHMC CITIZEN APP</span>
        </div>
        <div className="header-body">
          <img src="https://upload.wikimedia.org/wikipedia/en/2/2d/GHMC_logo.png" className="dashboard-logo" alt="GHMC" />
          <p className="mobile-number">{mobile}</p>
        </div>
      </header>

      <div className="dashboard-box">
        <h3 className="service-title">Pick Location</h3>

        <div className="map-container" style={{ height: "300px", marginBottom: "15px" }}>
          <MapContainer center={position} zoom={13} style={{ height: "100%", width: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker
              draggable={true}
              eventHandlers={eventHandlers}
              position={position}
              ref={markerRef}
            />
            <MapEvents setPos={setPosition} />
          </MapContainer>
        </div>

        <button className="locate-btn" onClick={handleCurrentLocation}>
          📍 Use Current Location
        </button>

        <p className="text-center" style={{ marginTop: "10px" }}>
          {address || "Drag marker to select location"}
        </p>

        <button className="submit-btn" onClick={handleSubmit}>
          Find Nearby GVPs
        </button>
      </div>
    </div>
  );
}
