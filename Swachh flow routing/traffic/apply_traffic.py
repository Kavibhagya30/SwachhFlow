def apply_traffic(G, hour):
    for u, v, k, data in G.edges(keys=True, data=True):

        # 1️⃣ base speed
        speed_kph = data.get("speed_kph", 30)

        # 2️⃣ traffic slowdown
        if hour in range(8, 11) or hour in range(17, 20):
            speed_kph *= 0.6

        speed_kph = max(speed_kph, 10)
        data["speed_kph"] = speed_kph

        # 3️⃣ CONVERT meters → minutes (THIS IS THE KEY)
        length_m = data.get("length", 0)

        time_minutes = (length_m / 1000) / speed_kph * 60
        data["travel_time"] = max(int(time_minutes), 1)

    return G
