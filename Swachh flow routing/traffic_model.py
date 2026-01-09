from distance_utils import haversine_distance

TRAFFIC_SPEEDS = {
    "morning": 20,     # 8–11 AM
    "afternoon": 30,   # 11 AM – 5 PM
    "evening": 25,     # 5–8 PM
    "night": 35        # 8 PM onwards
}

def traffic_time(lat1, lon1, lat2, lon2, time_slot="morning"):
    speed = TRAFFIC_SPEEDS.get(time_slot, 30)
    distance = haversine_distance(lat1, lon1, lat2, lon2)
    time_minutes = (distance / speed) * 60
    return max(1, time_minutes)  # never zero
