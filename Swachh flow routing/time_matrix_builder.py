from traffic_model import traffic_time
all_points = [
    {"id": "SCTP_1", "lat": 17.38, "lng": 78.48},
    {"id": "GVP_1", "lat": 17.39, "lng": 78.49},
    {"id": "GVP_2", "lat": 17.40, "lng": 78.50},
]

def build_time_matrix(points):
    matrix = []

    for i in points:
        row = []
        for j in points:
            if i == j:
                row.append(0)
            else:
                t = traffic_time(i["lat"], i["lng"], j["lat"], j["lng"])
                row.append(int(t))
        matrix.append(row)

    return matrix
if __name__ == "__main__":
    tm = build_time_matrix(all_points)
    for row in tm:
        print(row)
