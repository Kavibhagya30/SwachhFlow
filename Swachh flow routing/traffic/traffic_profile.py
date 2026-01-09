def apply_traffic(G, hour):
    for u, v, k, data in G.edges(keys=True, data=True):
        base_speed = data.get("speed_kph", 30)

        if 8 <= hour <= 11:       # Morning peak
            factor = 0.5
        elif 17 <= hour <= 20:    # Evening peak
            factor = 0.6
        else:
            factor = 1.0

        data["speed_kph"] = max(10, base_speed * factor)
        data["travel_time"] = (data["length"] / 1000) / data["speed_kph"] * 60

    return G
