import osmnx as ox
def map_points_to_nodes(G, nodes):
    mapped = []

    for n in nodes:
        nearest = ox.distance.nearest_nodes(
            G,
            n["lng"],
            n["lat"]
        )

        mapped.append({
            "osmid": nearest,      # used for routing
            "id": n["id"],         # preserved
            "type": n["type"],     # preserved
            "lat": n["lat"],
            "lng": n["lng"],
            "demand": n["demand"]
        })

    return mapped
