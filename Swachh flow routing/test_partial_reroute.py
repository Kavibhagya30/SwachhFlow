from partial_reroute import partial_reroute

# GVP coordinates
gvp_coordinates = {
    0: (17.3850, 78.4867),  # depot
    1: (17.3900, 78.4870),
    2: (17.3920, 78.4890),
    3: (17.3950, 78.4900)
}

# Service times per GVP
service_times = {1:20, 2:25, 3:20}

# Waste per GVP
waste_list = {1:200, 2:150, 3:100}

# Remaining GVPs after some trucks cleared 1 and 3
remaining_gvps = [2]

# Active trucks
active_trucks = [
    {"truck_id":0, "current_position":1, "capacity_left":300},
    {"truck_id":1, "current_position":0, "capacity_left":200}
]

new_routes = partial_reroute(
    remaining_gvps, active_trucks, gvp_coordinates, service_times, waste_list, old_version=1
)

for r in new_routes:
    print(r)
