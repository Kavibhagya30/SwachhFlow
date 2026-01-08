from datetime import datetime
import uuid

def create_route(truck_id, route_nodes, estimated_time, version=1):
    return {
        "route_id": str(uuid.uuid4()),
        "truck_id": truck_id,
        "version": version,
        "timestamp": datetime.utcnow().isoformat(),
        "route": route_nodes,
        "estimated_time": estimated_time,
        "status": "active"
    }
