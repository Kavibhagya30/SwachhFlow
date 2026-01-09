from backend.database import SessionLocal
from backend.models import User, TruckRoute, TruckDriverAssignment, GVP

db = SessionLocal()

print("--- DEBUG INFO ---")
print(f"GVPs count: {db.query(GVP).count()}")
print(f"Routes count: {db.query(TruckRoute).count()}")
print(f"Assignments count: {db.query(TruckDriverAssignment).count()}")
print(f"Users count: {db.query(User).count()}")

print("\n--- DRIVERS ---")
for u in db.query(User).filter(User.role == "DRIVER").all():
    print(f"Driver: {u.name}, Mobile: {u.mobile_number}")

print("\n--- ASSIGNMENTS ---")
for a in db.query(TruckDriverAssignment).all():
    print(f"Truck: {a.truck_id} -> Driver: {a.driver_mobile} (Route ID: {a.route_id})")

print("\n--- ROUTES ---")
for r in db.query(TruckRoute).all():
    print(f"Route ID: {r.route_id}, Truck: {r.truck_id}, Points: {len(r.route_json)}")

db.close()
