import { Link } from "react-router-dom";
import "./Map.css";

export default function Map() {
  return (
    <>
      {/* ===== TOP NAV (SAME AS DASHBOARD) ===== */}
      <div className="top-nav">
        <div className="container nav-right">
          <Link to="/" className="nav-link">Dashboard</Link>
          <Link to="/reports" className="nav-link">Reports</Link>
        </div>
      </div>

      {/* ===== HEADER ===== */}
      <header className="main-header">
        <div className="container">
          <h1>Greater Hyderabad Municipal Corporation</h1>
          <h2>గ్రేటర్ హైదరాబాద్ మున్సిపల్ కార్పొరేషన్</h2>
        </div>
      </header>

      {/* ===== IMAGE STRIP ===== */}
      <section className="image-strip">
        <div className="container image-grid">
          <img src="https://picsum.photos/400/220?1" alt="img1" />
          <img src="https://picsum.photos/400/220?2" alt="img2" />
          <img src="https://picsum.photos/400/220?3" alt="img3" />
          <img src="https://picsum.photos/400/220?4" alt="img4" />
        </div>
      </section>

      {/* ===== MAP CONTENT ===== */}
      <div className="map-page">
        <h2 className="map-title">GVP Map View</h2>

        {/* Placeholder for future map */}
        <div className="map-container">
          <p>🗺️ Map will be displayed here</p>
        </div>
      </div>
    </>
  );
}
