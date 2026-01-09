from sqlalchemy import Column, Integer, String, Float, DateTime, Text, JSON, ForeignKey, Date, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base

class GVP(Base):
    __tablename__ = "gvps"

    gvp_id = Column(Integer, primary_key=True, index=True)
    gvp_name = Column(Text, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    waste_estimated_tonnes = Column(Integer)
    status = Column(String(20), default='PENDING') # PENDING / COLLECTED / VERIFIED
    critical_level = Column(String(20), nullable=True) # HIGH / MEDIUM / LOW (If partial)
    last_updated = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Note: PostGIS geometry column would be added via raw SQL or GeoAlchemy2 if needed, 
    # but for simplicity in this python model we focus on lat/lon columns.
    # The index creation provided by user is raw SQL, we can execute that in seed/init.

class TruckRoute(Base):
    __tablename__ = "truck_routes"

    route_id = Column(Integer, primary_key=True, index=True)
    truck_id = Column(String(20), nullable=False, index=True)
    route_json = Column(JSON, nullable=False)
    estimated_time_minutes = Column(Integer)
    route_date = Column(Date, default=func.current_date())
    version = Column(Integer, default=1)

class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True)
    name = Column(Text)
    mobile_number = Column(String(15), unique=True, nullable=False, index=True)
    role = Column(String(20)) # DRIVER / SUPERVISOR / ADMIN
    penalty_points = Column(Integer, default=0)
    latitude = Column(Float)
    longitude = Column(Float)
    last_seen = Column(DateTime, default=func.now())

class TruckDriverAssignment(Base):
    __tablename__ = "truck_driver_assignment"

    assignment_id = Column(Integer, primary_key=True, index=True)
    truck_id = Column(String(20), nullable=False)
    driver_mobile = Column(String(15), ForeignKey("users.mobile_number"))
    route_id = Column(Integer, ForeignKey("truck_routes.route_id"))
    assignment_time = Column(DateTime, default=func.now())

    driver = relationship("User")
    route = relationship("TruckRoute")

class Alert(Base):
    __tablename__ = "alerts"
    
    alert_id = Column(Integer, primary_key=True, index=True)
    truck_id = Column(String(20))
    alert_type = Column(String(50)) # TRUCK_FAILURE, FUEL_LOW, TRAFFIC
    details = Column(Text) # Traffic delay duration etc.
    timestamp = Column(DateTime, default=func.now())
