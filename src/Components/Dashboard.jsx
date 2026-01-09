import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Dashboard.css";

export default function Dashboard() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedGvp, setSelectedGvp] = useState(null);
  const [gvpData, setGvpData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGvps();
  }, []);

  const fetchGvps = async () => {
    try {
      const response = await axios.get("http://localhost:8000/gvps");
      // Map API response to UI model
      const mapped = response.data.map(item => ({
        name: item.gvp_name,
        status: mapStatus(item.status),
        problem: `Estimated Waste: ${item.waste_estimated_tonnes} Tonnes`,
        raw: item
      }));
      setGvpData(mapped);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch GVPs", error);
      setLoading(false);
    }
  };

  const mapStatus = (status) => {
    switch (status) {
      case "PENDING": return "Not Cleared";
      case "COLLECTED": return "Partially Cleared";
      case "VERIFIED": return "Cleared";
      default: return status;
    }
  };

  const filteredData = gvpData.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "All" || item.status === filter;
    return matchesSearch && matchesFilter;
  });

  const statusScore = {
    "Cleared": 100,
    "Partially Cleared": 50,
    "Not Cleared": 0,
  };

  const totalScore = gvpData.reduce(
    (sum, item) => sum + (statusScore[item.status] || 0),
    0
  );

  const completionPercentage = gvpData.length
    ? Math.round((totalScore / (gvpData.length * 100)) * 100)
    : 0;

  return (
    <>
      {/* ===== TOP NAV ===== */}
      <div className="top-nav">
        <div className="container nav-right">
          <Link to="/reports" className="nav-link">Reports</Link>
          <Link to="/maps" className="nav-link">Maps</Link>
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

      {/* ===== GVP SECTION ===== */}
      <section className="gvp-section">
        <h2 className="gvp-title">GVP Points {loading && "(Loading...)"}</h2>

        <div className="gvp-wrapper">
          <div className="gvp-controls">
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="All">All</option>
              <option value="Cleared">Cleared</option>
              <option value="Partially Cleared">Partially Cleared</option>
              <option value="Not Cleared">Not Cleared</option>
            </select>
          </div>

          <div className="gvp-list">
            {filteredData.map((item, index) => (
              <div className="gvp-card" key={index}>
                <span className="gvp-name">{item.name}</span>

                <span
                  className={`gvp-status ${item.status
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                  onClick={() => setSelectedGvp(item)}
                >
                  <span className="dot"></span>
                  {item.status}
                </span>
              </div>
            ))}
          </div>

          <div className="overall-status">
            <h3>Overall Status</h3>
            <p>{completionPercentage}% Completed</p>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {selectedGvp && (
        <div className="popup-overlay" onClick={() => setSelectedGvp(null)}>
          <div className="popup-box" onClick={(e) => e.stopPropagation()}>
            <h3>{selectedGvp.name}</h3>
            <p><strong>Problem:</strong><br />{selectedGvp.problem}</p>
            <p><strong>Lat:</strong> {selectedGvp.raw.latitude}</p>
            <p><strong>Lng:</strong> {selectedGvp.raw.longitude}</p>
            <button onClick={() => setSelectedGvp(null)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}
