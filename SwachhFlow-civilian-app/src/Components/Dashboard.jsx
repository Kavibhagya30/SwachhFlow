import "./Dashboard.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const mobile = location.state?.mobile || "9876543210";

  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmType, setConfirmType] = useState(null); // "exit" | "logout"

  return (
    <div className="dashboard">
      {/* ================= HEADER ================= */}
      <header className="dashboard-header">
        {/* TOP NAV BAR */}
        <div className="top-nav">
          <span className="menu-icon" onClick={() => setMenuOpen(true)}>
            ☰
          </span>
          <span className="nav-title">GHMC CITIZEN APP</span>
        </div>

        {/* LOGO + USER INFO */}
        <div className="header-body">
          <img
            src="https://upload.wikimedia.org/wikipedia/en/2/2d/GHMC_logo.png"
            alt="GHMC"
            className="dashboard-logo"
          />
          <p className="mobile-number">{mobile}</p>

          <div className="header-footer">
            <span>02-01-2026</span>
            <span>V: 6.4</span>
          </div>
        </div>
      </header>

      {/* ================= DASHBOARD GRID ================= */}
      <div className="dashboard-box">
        <div className="dashboard-grid">
          <div className="grid-item green">
            👥 Grievances
          </div>

          <div
            className="grid-item blue"
            onClick={() =>
              navigate("/services", { state: { mobile } })
            }
          >
            🌼 Services
          </div>

          <div className="grid-item peach">
            📍 Where Am I
          </div>

          <div className="grid-item lavender">
            🏙 Near Me
          </div>

          <div className="grid-item yellow">
            ☁ Weather Alert
          </div>

          <div className="grid-item mint">
            📱 Know Your Ward Office
          </div>

          <div className="grid-item peach">
            👮 Know Your Officer
          </div>
        </div>
      </div>

      {/* ================= SIDEBAR ================= */}
      {menuOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setMenuOpen(false)}
        >
          <div
            className="sidebar"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>GHMC Citizen App</h3>

            <div className="section">
              <p className="section-title">Profile</p>
              <p>Inbox</p>
              <p>My Property</p>
              <p>My Trade</p>
              <p>Grievance History</p>
            </div>

            <div className="section">
              <p className="section-title">Services</p>
              <p onClick={() => navigate("/services", { state: { mobile } })}>
                Services
              </p>
              <p>Idea Box</p>
              <p>LRS</p>
              <p>Birth Certificate</p>
              <p>Death Certificate</p>
              <p>Grievances</p>
            </div>

            <div className="section">
              <p className="section-title">Others</p>
              <p>Help</p>
              <p>Share</p>
              <p onClick={() => setConfirmType("exit")}>Exit</p>
              <p onClick={() => setConfirmType("logout")}>Logout</p>
            </div>

            <div className="section">
              <p className="section-title">Info</p>
              <p>Terms & Conditions</p>
              <p>Privacy Policy</p>
            </div>
          </div>
        </div>
      )}

      {/* ================= CONFIRM MODAL ================= */}
      {confirmType && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-icon">!</div>
            <h3>GHMC</h3>
            <p>
              Are you sure you want to{" "}
              {confirmType === "exit" ? "exit" : "logout"} from this
              application?
            </p>

            <div className="modal-actions">
              <button
                className="yes-btn"
                onClick={() => {
                  if (confirmType === "logout") {
                    navigate("/");
                  }
                  setConfirmType(null);
                  setMenuOpen(false);
                }}
              >
                Yes
              </button>

              <button
                className="no-btn"
                onClick={() => setConfirmType(null)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
