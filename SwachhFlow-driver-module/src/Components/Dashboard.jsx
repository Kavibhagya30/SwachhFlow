import { useState } from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";

export default function Dashboard() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedGvp, setSelectedGvp] = useState(null);

  const gvpData = [
    {
      name: "Dammaiguda Petrol Bunk",
      status: "Cleared",
      problem: "Waste accumulation cleared completely. Area is clean and maintained.",
    },
    {
      name: "Vampuguda Graveyard",
      status: "Partially Cleared",
      problem: "Plastic waste still present near the boundary wall.",
    },
    {
      name: "Kandiguda Anganwadi",
      status: "Cleared",
      problem: "All garbage removed and sanitation completed.",
    },
    {
      name: "Yellareddyguda Graveyard",
      status: "Not Cleared",
      problem: "Heavy dumping observed. Immediate cleaning action required.",
    },
    {
      name: "Sai Puri Post Office",
      status: "Partially Cleared",
      problem: "Organic waste cleared, construction debris still remains.",
    },
  ];

  const filteredData = gvpData.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "All" || item.status === filter;
    return matchesSearch && matchesFilter;
  });

  const statusScore = {
    Cleared: 100,
    "Partially Cleared": 50,
    "Not Cleared": 0,
  };

  const totalScore = gvpData.reduce(
    (sum, item) => sum + statusScore[item.status],
    0
  );

  const completionPercentage = Math.round(
    (totalScore / (gvpData.length * 100)) * 100
  );

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
        <h2 className="gvp-title">GVP Points</h2>

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
            <button onClick={() => setSelectedGvp(null)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}
