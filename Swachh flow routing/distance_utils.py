import math

def haversine_distance(lat1, lon1, lat2, lon2):
    R = 6371  # Earth radius in km

    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)

    a = math.sin(dphi / 2)**2 + \
        math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2)**2

    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    return R * c  # km

def distance_to_time(distance_km, avg_speed_kmph=30):
    time_hours = distance_km / avg_speed_kmph
    return time_hours * 60  # minutes

if __name__ == "__main__":
    d = haversine_distance(17.3850, 78.4867, 17.4000, 78.5000)
    t = distance_to_time(d)
    print("Distance (km):", d)
    print("Time (min):", t)
