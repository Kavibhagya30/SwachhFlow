import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "./Service.css";
import "./GvpPoints.css";

export default function GvpPoints() {
  const navigate = useNavigate();
  const location = useLocation();
  const address = location.state?.address || "Unknown location";
  const mobile = "9876543210";

  const [expandedIndex, setExpandedIndex] = useState(null);
  const [gvpPoints, setGvpPoints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGvps();
  }, []);

  const fetchGvps = async () => {
    try {
      const res = await axios.get("http://localhost:8000/gvps");
      // Map to UI format
      const mapped = res.data.map(g => ({
        name: g.gvp_name,
        time: "10:00 AM", // Placeholder time
        status: g.status === "VERIFIED" ? "cleared" : "pending",
        distance: "0.5 km", // Placeholder
        collectionType: "Community Bin"
      }));
      setGvpPoints(mapped);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <div className="dashboard">
      {/* HEADER */}
      <header className="dashboard-header">
        <div className="top-nav">
          <span className="menu-icon" onClick={() => navigate(-1)}>
            ←
          </span>
          <span className="nav-title">GHMC CITIZEN APP</span>
        </div>

        <div className="header-body">
          <img
            src="https://upload.wikimedia.org/wikipedia/en/2/2d/GHMC_logo.png"
            className="dashboard-logo"
            alt="GHMC"
          />
          <p className="mobile-number">{mobile}</p>
        </div>

        <div className="header-footer">
          <span>02-01-2026</span>
          <span>V: 6.4</span>
        </div>
      </header>

      {/* CONTENT */}
      <div className="dashboard-box">
        <h3 className="service-title">Nearby GVP Points</h3>

        {loading && <p>Loading points...</p>}

        <p className="address-info">
          Based on your location: <b>{address}</b>
        </p>

        {/* TIMELINE */}
        <div className="gvp-timeline">
          {gvpPoints.map((gvp, index) => (
            <div key={index} className="gvp-row">
              {/* TIMELINE DOT */}
              <div className="timeline">
                <span className={`dot ${gvp.status === "cleared" ? "green" : "red"}`}></span>
                {index !== gvpPoints.length - 1 && (
                  <span className="line"></span>
                )}
              </div>

              {/* GVP CARD */}
              <div
                className={`gvp-details ${gvp.status === "cleared" ? "cleared" : ""
                  }`}
                onClick={() =>
                  setExpandedIndex(expandedIndex === index ? null : index)
                }
              >
                <div className="gvp-name">
                  {gvp.name}
                  {gvp.status === "cleared" && (
                    <span className="badge arriving" style={{ background: "green" }}>CLEARED</span>
                  )}
                </div>

                <div className="gvp-time">
                  Estimated pickup: {gvp.time}
                </div>

                {/* EXPANDABLE DETAILS */}
                {expandedIndex === index && (
                  <div className="gvp-extra">
                    <p>Distance: {gvp.distance}</p>
                    <p>Collection Type: {gvp.collectionType}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
