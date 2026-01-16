♻️ SwachhFlow

AI-Driven Smart Waste Collection & Monitoring Platform

License: MIT
Tech Stack: Python · OR-Tools · OpenStreetMap · Google Maps · Gemini AI · PostgreSQL · MinIO · Azure Hybrid Cloud

“Optimizing urban cleanliness through intelligent routing, real-time tracking, and AI-verified proof systems.”

📌 Overview

SwachhFlow is a scalable, AI-powered municipal waste collection optimization platform designed for large urban environments like Hyderabad (GHMC).
It intelligently plans garbage collection routes, verifies ground-level execution using AI image recognition, and provides real-time dashboards for administrators, drivers, and civilians.

The system balances operational efficiency, cost reduction, and sustainability, while remaining resilient under heavy traffic through a hybrid open-source + cloud failover architecture.

🌟 Key Capabilities
🚛 Intelligent Routing (OR-Tools)

Capacity-aware vehicle routing

Balanced GVP (Garbage Vulnerable Point) allocation per truck

Time-aware routing using static traffic models

Start & end at SCTPs (Secondary Collection Transfer Points)

Supports partial rerouting during failures

🗺️ Real-Time Maps

Drivers: Google Maps API (live traffic + navigation)

Dashboard & Civilian View: OpenStreetMap + Leaflet

City-wide visualization of GVPs and collection status

🧠 AI Verification Engine

Gemini 2.0 Flash for image recognition

Verifies whether garbage is present in geo-tagged photos

Prevents false collection claims

📸 Proof & Evidence Management

Geo-tagged photo uploads

Stored securely using MinIO (S3-compatible storage)

Metadata-only AI verification (privacy-first)

☁️ Hybrid Infrastructure (Resilience)

Primary: Open-source stack (self-hosted)

Fallback: Azure Cloud

Automatic failover during heavy traffic or system overload

Seamless recovery back to open-source layer

⚡ High-Concurrency Handling

Message queues for handling simultaneous driver updates

Caching routes on driver devices for low-network scenarios

🏗️ System Architecture (High-Level Flow)

Data Ingestion

GVPs, SCTPs, trucks loaded from structured datasets

Routing Engine

OR-Tools solves Vehicle Routing Problem (VRP)

Outputs optimized routes as JSON

Driver Execution

Routes cached locally

Navigation via Google Maps

Proof Submission

Geo-tagged photos uploaded

Stored in MinIO

AI Verification

Gemini validates garbage presence

Dashboard Update

Status reflected on live city map

Color-coded GVP states

Failover Handling

Load spike → Azure layer

Load normal → revert to open-source

📂 Project Structure
SwachhFlow/
├── routing_engine_real.py        # Core OR-Tools routing logic
├── traffic/
│   ├── osm_network.py            # OSM graph loader
│   ├── traffic_profile.py        # Static traffic model
│   ├── map_points.py             # Geo → road node mapping
│   └── time_matrix_traffic.py    # Travel time matrix
├── outputs/
│   └── routes_real.json          # Optimized routes
├── backend/
│   ├── ai/
│   │   └── gemini_verifier.py    # Image verification
│   ├── api/
│   │   └── endpoints.py          # REST APIs
│   └── services/
│       ├── proof_storage.py      # MinIO integration
│       └── queue_manager.py      # Update queues
├── frontend/
│   ├── dashboard/                # Admin dashboard
│   ├── driver_app/               # Driver interface
│   └── civilian_view/            # Public map (Leaflet)
└── README.md

⚙️ OR-Tools Algorithm (Used in SwachhFlow)

SwachhFlow uses Google OR-Tools Vehicle Routing Problem (VRP) solver with:

Greedy First Solution

Path Cheapest Arc heuristic

Constraint Modeling

Vehicle capacity (bin-packing behavior)

Time dimension (travel + service time)

Search Optimization

Branch & Bound for pruning

Local search to refine solutions

Scalability

Handles hundreds of trucks & thousands of GVPs

Polynomial growth with heuristics

⏱️ Typical solve time:

100–300 nodes: seconds

1000+ nodes: minutes (configurable)

🗄️ Database Design (PostgreSQL)
Table 1: gvp_locations
CREATE TABLE gvp_locations (
  gvp_id SERIAL PRIMARY KEY,
  name TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  waste_estimate INT
);

Table 2: truck_routes
CREATE TABLE truck_routes (
  truck_id TEXT,
  route JSONB,
  estimated_time INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

Table 3: users
CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  name TEXT,
  mobile_number TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION
);

Table 4: driver_assignments
CREATE TABLE driver_assignments (
  truck_id TEXT,
  driver_mobile TEXT,
  route JSONB
);

🌍 External APIs Used
Maps & Navigation

Google Maps API – Driver navigation & traffic

OpenStreetMap – Base map & routing graph

Leaflet.js – Web & civilian dashboards

AI & Verification

Gemini 2.0 Flash – Image recognition

Storage & Infra

MinIO – Proof storage

Azure Cloud – Hybrid failover

📈 Scalability & Performance

Horizontally scalable routing service

Queue-based update handling

Stateless backend APIs

Cache-enabled driver app

Cloud failover ensures zero downtime

🌱 Sustainability Impact

SwachhFlow directly supports:

Reduced fuel consumption

Lower emissions via optimized routing

Transparent waste accountability

Cleaner cities through verified execution

Aligned with UN Sustainable Development Goals (SDG 11 & 13).

📄 Sample Route Output (JSON)
{
  "truck_id": "TRK_12",
  "route": [
    { "type": "SCTP", "id": "SCTP_01" },
    { "type": "GVP", "id": "GVP_23" },
    { "type": "GVP", "id": "GVP_09" }
  ],
  "estimated_time": 215,
  "version": 1,
  "date": "2026-01-16"
}

🚀 Why SwachhFlow is Best-in-Class
Feature	SwachhFlow	Traditional Systems
Optimized Routing	✅ OR-Tools	❌ Static
AI Proof Validation	✅ Gemini	❌ Manual
Hybrid Resilience	✅ Azure Failover	❌ Single stack
Real-time Maps	✅ Yes	⚠️ Partial
Scalable	✅ High	❌ Limited
📜 License

MIT License
Free to use, modify, and deploy.
