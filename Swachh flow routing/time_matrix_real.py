import math
import pandas as pd
AVG_SPEED_KMPH = 25

def haversine(lat1, lon1, lat2, lon2):
    R = 6371
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)

    a = (math.sin(dlat/2)**2 +
         math.cos(math.radians(lat1)) *
         math.cos(math.radians(lat2)) *
         math.sin(dlon/2)**2)

    return 2 * R * math.asin(math.sqrt(a))


def travel_time_minutes(lat1, lon1, lat2, lon2):
    distance_km = haversine(lat1, lon1, lat2, lon2)
    return (distance_km / AVG_SPEED_KMPH) * 60

def build_time_matrix(nodes):
    size = len(nodes)
    matrix = [[0]*size for _ in range(size)]

    for i in range(size):
        for j in range(size):
            if i == j:
                continue
            base_time = travel_time_minutes(
                nodes[i]["lat"], nodes[i]["lng"],
                nodes[j]["lat"], nodes[j]["lng"]
            )

            # Static traffic adjustment
            if nodes[j].get("zone") == "market":
                base_time += 5

            if math.isnan(base_time):
                matrix[i][j] = 9999  # unreachable
            else:
                matrix[i][j] = int(base_time)


    return matrix
