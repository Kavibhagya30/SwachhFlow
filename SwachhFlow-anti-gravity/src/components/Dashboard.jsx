import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();

  // Logged-in user data
  const driver = JSON.parse(localStorage.getItem("driver"));

  // GVP data
  const gvpData = [
    { name: "Dammaiguda Petrol Bunk", status: "Cleared" },
    { name: "Vampuguda Graveyard", status: "Partially Cleared" },
    { name: "Kandiguda Anganwadi", status: "Not Cleared" },
    { name: "Yellareddyguda Graveyard", status: "Cleared" },
  ];

  // States
  const [search, setSearch] = useState("");
  const [activeIndex, setActiveIndex] = useState(null);

  // Filter by GVP name
  const filteredData = gvpData.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dashboard-root">
      
      {/* ================= NAVBAR ================= */}
      <div className="top-navbar">
        <div className="nav-left">{driver?.name || "Name"}</div>

        <div className="nav-center">
          {driver?.truckNumber || "Truck Number"}
        </div>

        <div className="nav-right">
          <img
            src="https://i.pravatar.cc/40"
            alt="profile"
            className="profile-img"
            title={driver?.name || "Profile"}
          />
        </div>
      </div>

      {/* ================= ACTION BUTTONS ================= */}
      <div className="action-bar">
        {/* ✅ FIXED: Alert now navigates to Alert Page */}
        <button
          className="alert-btn"
          onClick={() => navigate("/alert")}
        >
          Alert
        </button>

        <button
          className="map-btn"
          onClick={() => navigate("/maps")}
        >
          Show maps
        </button>
      </div>

      {/* ================= GVP STATUS BOX ================= */}
      <div className="gvp-container">
        <div className="gvp-box">

          {/* HEADER */}
          <div className="gvp-header">
            <div className="gvp-left-header">
              <h2>GVP Points</h2>
              <input
                type="text"
                placeholder="Search"
                className="gvp-search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <h2 className="gvp-right-header">Status</h2>
          </div>

          {/* ROWS */}
          {filteredData.map((item, index) => (
            <div
              key={index}
              className={`gvp-row ${
                activeIndex === index ? "active" : ""
              }`}
              onClick={() => setActiveIndex(index)}
            >
              <div className="gvp-name">{item.name}</div>

              <div
                className={`gvp-status ${item.status
                  .replace(" ", "")
                  .toLowerCase()}`}
              >
                <span className="dot"></span>
                {item.status}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
