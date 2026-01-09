import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import "./Service.css";
import "./GvpPoints.css";

export default function GvpPoints() {
  const navigate = useNavigate();
  const location = useLocation();
  const address = location.state?.address || "Unknown location";
  const mobile = "9876543210";

  const [expandedIndex, setExpandedIndex] = useState(null);

  // Mark first one as arriving, others upcoming
  const gvpPoints = [
    {
      name: "GVP Point – Street 12",
      time: "7:15 AM",
      status: "arriving",
    },
    {
      name: "GVP Point – Near Park",
      time: "7:30 AM",
      status: "upcoming",
    },
    {
      name: "GVP Point – Community Hall",
      time: "7:50 AM",
      status: "upcoming",
    },
  ];

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

        <p className="address-info">
          Based on your location: <b>{address}</b>
        </p>

        {/* TIMELINE */}
        <div className="gvp-timeline">
          {gvpPoints.map((gvp, index) => (
            <div key={index} className="gvp-row">
              {/* TIMELINE DOT */}
              <div className="timeline">
                <span className="dot"></span>
                {index !== gvpPoints.length - 1 && (
                  <span className="line"></span>
                )}
              </div>

              {/* GVP CARD */}
              <div
                className={`gvp-details ${
                  gvp.status === "arriving" ? "active" : ""
                }`}
                onClick={() =>
                  setExpandedIndex(expandedIndex === index ? null : index)
                }
              >
                <div className="gvp-name">
                  {gvp.name}
                  {gvp.status === "arriving" && (
                    <span className="badge arriving">Arriving Soon</span>
                  )}
                </div>

                <div className="gvp-time">
                  Truck arrives at {gvp.time}
                </div>

                {/* EXPANDABLE DETAILS */}
                {expandedIndex === index && (
                  <div className="gvp-extra">
                    <p>Distance: {index + 1} km</p>
                    <p>Collection Type: Door-to-door</p>
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
