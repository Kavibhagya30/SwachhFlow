from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class GVPBase(BaseModel):
    gvp_name: str
    latitude: float
    longitude: float

class GVPCreate(GVPBase):
    waste_estimated_tonnes: int

class GVPResponse(GVPBase):
    gvp_id: int
    waste_estimated_tonnes: Optional[int]
    status: str
    critical_level: Optional[str]
    last_updated: datetime

    class Config:
        from_attributes = True

class AlertCreate(BaseModel):
    truck_id: str
    alert_type: str
    details: str

class AlertResponse(AlertCreate):
    alert_id: int
    timestamp: datetime
    class Config:
        from_attributes = True

class RoutePoint(BaseModel):
    type: str # GVP or SCTP
    id: str | int
    # Add optional fields for detailed view if needed (lat/lng resolved)

class TruckRouteResponse(BaseModel):
    route_id: int
    truck_id: str
    estimated_time: float
    route: List[RoutePoint] # This parses the JSON route

    class Config:
        from_attributes = True

class UserCreate(BaseModel):
    name: str
    mobile_number: str
    role: str

class UserResponse(UserCreate):
    user_id: int
    last_seen: Optional[datetime]
    class Config:
        from_attributes = True
