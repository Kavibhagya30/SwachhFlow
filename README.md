♻️ SwachhFlow
Intelligent Waste Collection Routing & Monitoring Platform

License: MIT
Tech Stack: Python · OR-Tools · OpenStreetMap · Google Maps API · Gemini 2.0 Flash · Leaflet · MinIO · PostgreSQL

“Optimizing urban cleanliness through intelligent routing, verification, and real-time monitoring.”

📌 Overview

SwachhFlow is a smart municipal waste management system designed for large cities like Hyderabad.
It optimizes garbage collection routes, verifies ground-level work using AI image analysis, and visualizes city-wide cleanliness status in real time.

The platform combines:

Mathematical optimization (OR-Tools)

Geospatial intelligence (OSM + Google Maps)

AI verification (Gemini Vision)

Scalable hybrid infrastructure (Open-source + Azure failover)

🎯 Key Objectives

Minimize garbage collection time and fuel usage

Ensure fair load distribution across trucks

Provide real-time visibility of GVP (Garbage Vulnerable Point) status

Prevent false reporting using AI-based image verification

Remain operational under heavy traffic via hybrid cloud failover

🚀 Core Features
1️⃣ Intelligent Route Optimization

Vehicle Routing Problem (VRP) solved using Google OR-Tools

Constraints supported:

Truck capacity

Service time per GVP (20–25 minutes)

SCTP (depot) start & end

Balanced GVP distribution per truck

Static traffic-aware travel time using OpenStreetMap

2️⃣ Real-Time Driver Navigation

Google Maps API for drivers

Live traffic-aware navigation

Route caching in driver app for low-network scenarios

Geo-tagged proof capture at GVPs

3️⃣ AI-Based Garbage Verification

Uses Gemini 2.0 Flash Vision Model

Verifies:

Presence of garbage in submitted images

Image authenticity with geo-tags

Prevents fake or incorrect cleanup confirmations

4️⃣ City-Wide Monitoring Dashboard

Admin dashboard with:

Live truck movement

GVP status updates

Route progress visualization

Color-coded GVP states:

🔴 Pending

🟡 In Progress

🟢 Cleared

5️⃣ Civilian Public Interface

Built using Leaflet + OpenStreetMap

Public transparency:

View cleanliness status

Track cleared vs pending GVPs

Lightweight and open-source

6️⃣ Hybrid Infrastructure & Failover

Primary layer: Open-source stack

Automatic failover to Azure during:

High traffic

System overload

Seamless revert when load normalizes

7️⃣ Proof Storage & Auditability

MinIO Object Storage

Stores:

Geo-tagged images

Timestamped verification proofs

Enables audits and dispute resolution

8️⃣ High-Throughput Update Handling

Queue-based architecture for:

Driver updates

Image verification results

Prevents dashboard crashes during peak updates

🧠 OR-Tools Optimization Logic

SwachhFlow uses Google OR-Tools VRP Solver, which internally applies:

Greedy First Solution

Path Cheapest Arc heuristic

Constraint Modeling

Capacity (bin-packing behavior)

Time dimension (travel + service time)

Search Optimization

Branch & Bound pruning

Local search refinement

This ensures:

Scalable routing for 1000+ GVPs

Near-optimal solutions within seconds

Stable performance for large city datasets

🏗️ System Architecture (High Level)
Driver App ──► API Gateway ──► Queue Manager ──► Routing Engine (OR-Tools)
     │                               │
     │                               ├──► Gemini Vision (Verification)
     │                               │
     └──► Google Maps API            └──► MinIO (Proof Storage)

Admin Dashboard ──► PostgreSQL ──► Live Map (OSM / Leaflet)

Failover Layer ──► Azure Cloud (Auto-switch under heavy load)

📂 Project Structure
SwachhFlow/
│
├── routing_engine_real.py        # OR-Tools routing logic
├── traffic/
│   ├── osm_network.py            # OSM graph loader
│   ├── traffic_profile.py        # Static traffic model
│   └── time_matrix_traffic.py    # Travel time matrix
│
├── outputs/
│   └── routes_real.json          # Optimized routes
│
├── backend/
│   ├── ai/
│   │   └── gemini_verifier.py    # Image verification
│   ├── api/
│   │   └── endpoints.py          # REST APIs
│   ├── services/
│   │   ├── proof_storage.py      # MinIO integration
│   │   └── queue_manager.py      # Update queues
│
├── frontend/
│   ├── dashboard/                # Admin dashboard
│   ├── driver_app/               # Driver interface
│   └── civilian_view/            # Public Leaflet map
│
└── README.md

📈 Scalability

Horizontally scalable routing engine

Queue-based update ingestion

Stateless APIs

Cloud failover ready

Tested for 1000+ GVPs & 100+ trucks

🌍 Sustainable Development Impact

SwachhFlow contributes directly to:

SDG 11: Sustainable Cities & Communities

SDG 12: Responsible Consumption & Waste Management

SDG 13: Reduced emissions via optimized routing

⏱️ Performance

Route generation: Seconds to a few minutes

AI image verification: Sub-second

Dashboard updates: Real-time

Failover switch: Automatic

🛡️ Reliability & Trust

Geo-tagged proofs

AI-verified cleanliness

Immutable object storage

Transparent public dashboards

📜 License

MIT License
Open for academic, municipal, and production use.
