import pandas as pd
from ortools.constraint_solver import pywrapcp, routing_enums_pb2
import json
from time_matrix_real import build_time_matrix
from distance_utils import haversine_distance
from traffic.osm_network import load_hyderabad_graph
from traffic.traffic_profile import apply_traffic
from traffic.map_points import map_points_to_nodes
from traffic.time_matrix_traffic import build_traffic_time_matrix


def load_data():
    gvps = pd.read_excel("data/gvps.xlsx")
    sctps = pd.read_excel("data/sctps.xlsx")
    trucks = pd.read_excel("data/trucks.xlsx")
    return gvps, sctps, trucks

def build_nodes(gvps, sctps):
    nodes = []

    # 1️⃣ SCTPs FIRST
    for _, row in sctps.iterrows():
        # SCTPs
        nodes.append({
            "id": row["Transferstation"],
            "lat": row["latitude"],
            "lng": row["longitude"],
            "demand": 0,
            "type": "sctp"
        })

        # GVPs
    for _, row in gvps.iterrows():
        nodes.append({
            "id": row["Location of the GVPs"],   # ✅ exact
            "lat": float(row["Latitude"]),       # ✅ exact
            "lng": float(row["Longitude"]),      # ✅ exact
            "demand": int(row["Estimated Waste Generation"]),
            "type": "gvp"
        })



    return nodes


def build_vehicles(trucks_df):
    vehicle_capacities = []

    for _, row in trucks_df.iterrows():
        vehicle_capacities.extend(
            [int(row["Payload Capacity (in Tonnes)"])] * int(row["No. of Vehicles Available"])
        )

    return vehicle_capacities

def solve_routing(nodes, time_matrix, vehicle_capacities,depot_indices):

    if not depot_indices:
        raise RuntimeError("❌ No SCTP found — cannot start routes")
    starts = []
    ends = []

    for i in range(len(vehicle_capacities)):
        depot = depot_indices[i % len(depot_indices)]
        starts.append(depot)
        ends.append(depot)


    manager = pywrapcp.RoutingIndexManager(
        len(time_matrix),
        len(vehicle_capacities),
        starts,
        ends
    )


    routing = pywrapcp.RoutingModel(manager)
    for i, n in enumerate(nodes):
        if n["type"] == "gvp":
            routing.AddDisjunction([manager.NodeToIndex(i)], 10_000)
    SERVICE_TIME = 22
    def time_callback(from_index, to_index):
        from_node = manager.IndexToNode(from_index)
        to_node = manager.IndexToNode(to_index)

        travel_time = time_matrix[from_node][to_node]

        if nodes[to_node]["type"] == "gvp":
            travel_time += SERVICE_TIME

        return travel_time

    transit_cb = routing.RegisterTransitCallback(time_callback)
    routing.SetArcCostEvaluatorOfAllVehicles(transit_cb)

    # Capacity constraint
    def demand_callback(index):
        node_index = manager.IndexToNode(index)
        return int(nodes[node_index]["demand"])


    demand_cb = routing.RegisterUnaryTransitCallback(demand_callback)

    MAX_GVPS_PER_TRUCK = 15

    def gvp_count_callback(index):
        node = manager.IndexToNode(index)
        return 1 if nodes[node]["type"] == "gvp" else 0

    gvp_cb = routing.RegisterUnaryTransitCallback(gvp_count_callback)

    routing.AddDimensionWithVehicleCapacity(
        gvp_cb,
        0,
        [MAX_GVPS_PER_TRUCK] * len(vehicle_capacities),
        True,
        "GVP_COUNT"
    )

    routing.AddDimension(
        transit_cb,
        0,          # slack
        24 * 60,    # max route time (adjust if needed)
        True,
        "Time"
    )


    routing.AddDimensionWithVehicleCapacity(
        demand_cb,
        0,
        vehicle_capacities,
        True,
        "Capacity"
    )
    capacity_dim = routing.GetDimensionOrDie("Capacity")
    avg_load = sum(n["demand"] for n in nodes if n["type"]=="gvp") // routing.vehicles()

    for v in range(routing.vehicles()):
        capacity_dim.SetCumulVarSoftUpperBound(
            routing.End(v),
            avg_load,
            1000  # penalty
        )


    search_params = pywrapcp.DefaultRoutingSearchParameters()
    search_params = pywrapcp.DefaultRoutingSearchParameters()
    search_params.first_solution_strategy = (
        routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC
    )
    search_params.local_search_metaheuristic = (
        routing_enums_pb2.LocalSearchMetaheuristic.GUIDED_LOCAL_SEARCH
    )
    search_params.time_limit.seconds = 30
    solution = routing.SolveWithParameters(search_params)
    return routing, manager, solution

def extract_routes(routing, manager, solution, nodes):
    routes = []
    time_dimension = routing.GetDimensionOrDie("Time")

    for vehicle_id in range(routing.vehicles()):
        index = routing.Start(vehicle_id)
        route = []

        while not routing.IsEnd(index):
            node_index = manager.IndexToNode(index)
            route.append({
                "type": nodes[node_index]["type"].upper(),
                "id": nodes[node_index]["id"]
            })
            index = solution.Value(routing.NextVar(index))

        if len(route) <= 1:
            continue

        total_time = solution.Value(time_dimension.CumulVar(index))

        routes.append({
            "truck_id": f"T{vehicle_id}",
            "route": route,
            "estimated_time": total_time
        })

        print(f"⏱ Truck {vehicle_id}: {total_time} min")

    return routes

print("🚛 Solving routing problem...")
gvps, sctps, trucks = load_data()
print("GVP columns:", gvps.columns.tolist())

nodes = build_nodes(gvps, sctps)
print("Total nodes before validation:", len(nodes))
def validate_nodes(nodes):
    clean = []
    skipped = []

    for n in nodes:
        try:
            lat = float(n["lat"])
            lng = float(n["lng"])

            # Reject invalid coordinates
            if lat == 0 or lng == 0:
                raise ValueError("Zero coordinate")

            if not (-90 <= lat <= 90 and -180 <= lng <= 180):
                raise ValueError("Out of bounds")

            clean.append({
                **n,
                "lat": lat,
                "lng": lng
            })

        except Exception:
            skipped.append(n)

    print(f"⚠️ Skipped {len(skipped)} invalid nodes")
    return clean

nodes = validate_nodes(nodes)
print("Total nodes after validation:", len(nodes))
vehicle_capacities = build_vehicles(trucks)

print("🚦 Loading Hyderabad road network...")
G = load_hyderabad_graph()
print("✅ Road network loaded")

print("🚧 Applying traffic model...")
G = apply_traffic(G, hour=9)
edge = list(G.edges(data=True))[0][2]
print("travel_time =", edge.get("travel_time"))

print("✅ Traffic applied")

print("📍 Mapping nodes to road network...")
road_nodes = map_points_to_nodes(G, nodes)
nodes=road_nodes
print("✅ Mapping complete")

print("🧮 Building traffic-aware time matrix...")
time_matrix = build_traffic_time_matrix(G, nodes)
print("✅ Time matrix ready")
depot_indices = [i for i, n in enumerate(nodes) if n["type"] == "sctp"]

if not depot_indices:
    raise RuntimeError("❌ No SCTP depots found")


routing, manager, solution = solve_routing(
    nodes,
    time_matrix,
    vehicle_capacities,
    depot_indices
)
print(time_matrix[0][1])

if not solution:
    print("❌ No solution found")
    exit()

print("🎉 Routing solved!")

routes = extract_routes(routing, manager, solution, nodes)

# Save output
with open("outputs/routes_real.json", "w") as f:
    json.dump(routes, f, indent=2)

print("📄 Routes saved to outputs/routes_real.json")
