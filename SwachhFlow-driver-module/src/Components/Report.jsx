import { useState } from "react";
import { Link } from "react-router-dom";
import "./Report.css";

export default function Reports() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const issueData = [
    { gvp: "Dammaiguda Petrol Bunk", category: "Truck Failure", time: "12:00 PM" },
    { gvp: "Vampuguda Graveyard", category: "Fuel Insufficient", time: "3:00 PM" },
    { gvp: "Kandiguda Anganwadi", category: "Traffic Delay", time: "5:00 PM" },
    { gvp: "Yellareddyguda Graveyard", category: "Partial Dealing", time: "5:00 AM" },
  ];

  const filteredIssues = issueData.filter((item) => {
    const matchesSearch = item.gvp.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "All" || item.category === filter;
    return matchesSearch && matchesFilter;
  });

  const visibleCategories = [...new Set(filteredIssues.map(i => i.category))];

  return (
    <>
      {/* ===== TOP NAV ===== */}
      <div className="top-nav">
        <div className="container nav-right">
          <Link to="/" className="nav-link">Dashboard</Link>
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
          <img src="https://picsum.photos/400/220?1" />
          <img src="https://picsum.photos/400/220?2" />
          <img src="https://picsum.photos/400/220?3" />
          <img src="https://picsum.photos/400/220?4" />
        </div>
      </section>

      {/* ===== REPORTS ===== */}
      <div className="reports-page">
        <div className="report-controls">
          <input
            type="text"
            placeholder="Search GVP"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="All">All Issues</option>
            <option value="Truck Failure">Truck Failure</option>
            <option value="Fuel Insufficient">Fuel Insufficient</option>
            <option value="Traffic Delay">Traffic Delay</option>
            <option value="Partial Dealing">Partial Dealing</option>
          </select>
        </div>

        <div className="report-table">
          <div className="category-column">
            <div className="table-header">Category</div>
            {visibleCategories.map((cat, i) => (
              <div
                key={i}
                className={`category-box ${filter === cat ? "active" : ""}`}
                onClick={() => setFilter(cat)}
              >
                {cat}
              </div>
            ))}
            {filter !== "All" && (
              <div className="category-box clear-filter" onClick={() => setFilter("All")}>
                Clear Filter
              </div>
            )}
          </div>

          <div className="issue-column">
            <div className="table-header">Issue Report</div>
            {filteredIssues.map((item, i) => (
              <div key={i} className="issue-box">
                <strong>{item.gvp}</strong><br />
                Time: {item.time}<br />
                Issue: {item.category}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
