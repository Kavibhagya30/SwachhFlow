# 🌿 SwachhFlow  
### Intelligent Waste Collection Routing & Monitoring Platform

**License:** MIT  
**Tech Stack:** Python · Google OR-Tools · OpenStreetMap · Google Maps API · Gemini 2.0 Flash · Leaflet · MinIO · PostgreSQL  

> *Optimizing urban cleanliness through intelligent routing, AI verification, and real-time city monitoring.*

---

## 📌 Overview

**SwachhFlow** is a large-scale, intelligent municipal waste-management platform designed for metropolitan cities such as **Hyderabad**.  
It optimizes garbage collection routes, ensures fair workload distribution across trucks, verifies ground-level cleaning using AI, and visualizes city-wide cleanliness in real time.

The system is built for **high scalability**, **fault tolerance**, and **data-driven governance**.

---

## 🎯 Core Objectives

- Minimize garbage collection time and fuel consumption  
- Ensure **balanced load distribution** across trucks  
- Provide **real-time visibility** of GVP (Garbage Vulnerable Point) status  
- Prevent false reporting using **AI-based image verification**  
- Maintain uninterrupted service via **hybrid failover architecture**

---

## 🧠 Key Capabilities

### 🚛 Intelligent Route Optimization
- Vehicle Routing Problem (VRP) solved using **Google OR-Tools**
- Traffic-aware travel time matrix (OSM + static congestion model)
- Constraints supported:
  - Truck capacity
  - Maximum GVPs per truck
  - Service time per GVP
  - Start and end at SCTP

### ⚖️ Fair Load Distribution
- Explicit **Max GVPs per Truck** constraint
- Prevents route imbalance (no empty trucks / overloaded trucks)

### 🗺️ Real-Time City Visualization
- **Admin Dashboard:** OpenStreetMap + Leaflet
- **Driver App:** Google Maps API with live traffic
- **Civilian View:** Public city map with color-coded cleanliness status

### 🎨 Color-Coded GVP Status
| Color | Meaning |
|------|--------|
| 🟢 Green | Clean & Verified |
| 🟡 Yellow | Assigned / In Progress |
| 🔴 Red | Pending / Not Cleaned |
| 🔵 Blue | Re-routed |

---

## 🤖 AI-Based Verification

- **Model:** Gemini 2.0 Flash (Vision)
- **Purpose:** Verify whether garbage is present in geo-tagged images submitted by drivers
- **Pipeline:**
  1. Driver uploads photo with GPS metadata
  2. Image stored in **MinIO**
  3. Gemini Vision verifies cleanliness
  4. GVP status updated on city map

> Prevents fake or incorrect clean-up reporting.

---

## 🏗️ System Architecture (High Level)

```text
Driver App (Google Maps)
        |
        v
API Gateway (FastAPI)
        |
        +--> OR-Tools Routing Engine
        |
        +--> Queue Manager (Async Updates)
        |
        +--> AI Verification (Gemini Vision)
        |
        +--> MinIO (Proof Storage)
        |
        v
PostgreSQL (Routes, GVPs, Status)
        |
        v
Admin Dashboard (Leaflet + OSM)
