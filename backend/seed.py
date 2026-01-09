import pandas as pd
import json
import os
import sys
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import subprocess

# Local imports (assuming run as python -m backend.seed)
from .database import SessionLocal, engine, DB_NAME, DB_USER, DB_PASS, DB_HOST, DB_PORT
from .models import GVP, TruckRoute, User, TruckDriverAssignment, Base

# Path configuration
# backend/seed.py -> backend/ -> SwachhFlow/
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ROUTING_DIR = os.path.join(BASE_DIR, "Swachh flow routing")
DATA_DIR = os.path.join(ROUTING_DIR, "data")
OUTPUTS_DIR = os.path.join(ROUTING_DIR, "outputs")

def create_database_if_not_exists():
    import psycopg2
    from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

    try:
        # Connect to default 'postgres' db to check/create target db
        con = psycopg2.connect(user=DB_USER, password=DB_PASS, host=DB_HOST, port=DB_PORT, dbname='postgres')
        con.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cur = con.cursor()
        
        cur.execute(f"SELECT 1 FROM pg_catalog.pg_database WHERE datname = '{DB_NAME}'")
        exists = cur.fetchone()
        
        if not exists:
            print(f"Database {DB_NAME} does not exist. Creating...")
            cur.execute(f"CREATE DATABASE {DB_NAME}")
            print(f"Database {DB_NAME} created.")
        else:
            print(f"Database {DB_NAME} already exists.")
            
        cur.close()
        con.close()
    except Exception as e:
        print(f"Error checking/creating database: {e}")

def seed_data():
    create_database_if_not_exists()
    
    # Ensure tables exist
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    
    # 1. Clear existing data
    try:
        db.query(TruckDriverAssignment).delete()
        db.query(TruckRoute).delete()
        db.query(GVP).delete()
        db.query(User).delete()
        db.commit()
    except Exception as e:
        print(f"Error clearing tables: {e}")
        db.rollback()

    print("🌱 loading Excel data...")
    if not os.path.exists(os.path.join(DATA_DIR, "gvps.xlsx")):
        print(f"❌ Data file not found: {os.path.join(DATA_DIR, 'gvps.xlsx')}")
        return

    gvps_df = pd.read_excel(os.path.join(DATA_DIR, "gvps.xlsx"))
    
    # 2. Insert GVPs
    print(f"Inserting {len(gvps_df)} GVPs...")
    for _, row in gvps_df.iterrows():
        gvp = GVP(
            gvp_name=str(row.get("Location of the GVPs", "Unknown")),
            latitude=float(row["Latitude"]),
            longitude=float(row["Longitude"]),
            waste_estimated_tonnes=int(row.get("Estimated Waste Generation", 0)),
            status="PENDING"
        )
        db.add(gvp)
    db.commit()

    # 3. Create Dummy Users (Drivers)
    trucks_df = pd.read_excel(os.path.join(DATA_DIR, "trucks.xlsx"))
    total_trucks = int(trucks_df["No. of Vehicles Available"].sum()) if "No. of Vehicles Available" in trucks_df else 5
    
    print(f"Creating {total_trucks} dummy drivers...")
    for i in range(total_trucks):
        mobile = f"999999990{i}"
        user = User(
            name=f"Driver {i+1}",
            mobile_number=mobile,
            role="DRIVER",
            latitude=17.3850,
            longitude=78.4867
        )
        # Check if exists (since we deleted, should be fine, but rigorous check)
        # db.merge(user)
        db.add(user)
    db.commit()

    # 4. Run Routing Engine
    print("🚚 Running Routing Engine...")
    try:
        # Check if python or python3
        cmd = [sys.executable, "routing_engine_real.py"]
        subprocess.check_call(cmd, cwd=ROUTING_DIR)
        print("Routing engine finished successfully.")
    except Exception as e:
        print(f"Failed to run routing engine: {e}")
        
    # 5. Load Routes from JSON
    routes_file = os.path.join(OUTPUTS_DIR, "routes_real.json")
    if os.path.exists(routes_file):
        print("📥 Loading routes into DB...")
        with open(routes_file, "r") as f:
            routes_data = json.load(f)
            
        for r_idx, r_data in enumerate(routes_data):
            truck_id = r_data.get("truck_id", f"T{r_idx}")
            
            # Create Route Record
            route_entry = TruckRoute(
                truck_id=truck_id,
                route_json=r_data["route"],
                estimated_time_minutes=int(r_data.get("estimated_time", 0)),
                route_date=datetime.now().date()
            )
            db.add(route_entry)
            db.commit() 
            
            # Assign to a driver
            driver_mobile = f"999999990{r_idx}"
            # Verify driver exists
            driver = db.query(User).filter(User.mobile_number == driver_mobile).first()
            if driver:
                assignment = TruckDriverAssignment(
                    truck_id=truck_id,
                    driver_mobile=driver_mobile,
                    route_id=route_entry.route_id
                )
                db.add(assignment)
        
        db.commit()
        print("✅ Seeding Complete!")
    else:
        print("❌ Routes JSON file not found!")

    db.close()

if __name__ == "__main__":
    seed_data()
