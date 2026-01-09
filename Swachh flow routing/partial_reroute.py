from ortools.constraint_solver import routing_enums_pb2
from ortools.constraint_solver import pywrapcp
from datetime import datetime
from route_model import create_route
from distance_utils import haversine_distance
from traffic_model import TRAFFIC_SPEEDS

# ---------- HELPER FUNCTIONS ----------

def traffic_time(lat1, lon1, lat2, lon2, time_slot="morning"):
    speed = TRAFFIC_SPEEDS.get(time_slot, 30)
    distance = haversine_distance(lat1, lon1, lat2, lon2)
    return max(1, (distance / speed) * 60)

# ---------- MAIN PARTIAL REROUTE FUNCTION ----------

def partial_reroute(remaining_gvps, active_trucks, gvp_coordinates, service_times, waste_list, old_version=1):
    """
    remaining_gvps: list of GVP IDs still pending
    active_trucks: list of dicts -> {"truck_id", "current_position", "capacity_left"}
    gvp_coordinates: dict -> {GVP_ID: (lat, lon)}
    service_times: dict -> {GVP_ID: minutes}
    waste_list: dict -> {GVP_ID: waste_amount}
    old_version: int
    """
    # Build reduced point list
    depot_id = 0  # SCTP
    points = [depot_id] + remaining_gvps

    # Build reduced time matrix
    n = len(points)
    time_matrix = [[0]*n for _ in range(n)]
    for i in range(n):
        for j in range(n):
            if i == j:
                time_matrix[i][j] = 0
            else:
                lat1, lon1 = gvp_coordinates.get(points[i], (0,0))
                lat2, lon2 = gvp_coordinates.get(points[j], (0,0))
                time_matrix[i][j] = int(traffic_time(lat1, lon1, lat2, lon2))

    # Setup OR-Tools
    num_vehicles = len(active_trucks)
    manager = pywrapcp.RoutingIndexManager(len(points), num_vehicles, 0)
    routing = pywrapcp.RoutingModel(manager)

    # Travel + service time callback
    def time_callback(from_index, to_index):
        from_node = manager.IndexToNode(from_index)
        to_node = manager.IndexToNode(to_index)
        travel = time_matrix[from_node][to_node]
        service = service_times.get(points[from_node], 20)
        return travel + service

    transit_callback_index = routing.RegisterTransitCallback(time_callback)
    routing.SetArcCostEvaluatorOfAllVehicles(transit_callback_index)

    # Add capacity dimension
    def demand_callback(from_index):
        node = manager.IndexToNode(from_index)
        return waste_list.get(points[node], 0)

    demand_callback_index = routing.RegisterUnaryTransitCallback(demand_callback)
    capacities = [truck["capacity_left"] for truck in active_trucks]

    routing.AddDimensionWithVehicleCapacity(
        demand_callback_index,
        0,
        capacities,
        True,
        "Capacity"
    )

    # Solve
    search_parameters = pywrapcp.DefaultRoutingSearchParameters()
    search_parameters.first_solution_strategy = routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC

    solution = routing.SolveWithParameters(search_parameters)
    if not solution:
        return []

    # Build new route objects
    new_routes = []

    for vehicle_id in range(num_vehicles):
        index = routing.Start(vehicle_id)
        route_nodes = []
        total_time = 0

        while not routing.IsEnd(index):
            node = manager.IndexToNode(index)
            route_nodes.append(points[node])
            next_index = solution.Value(routing.NextVar(index))
            total_time += routing.GetArcCostForVehicle(index, next_index, vehicle_id)
            index = next_index

        # Append depot explicitly at end
        route_nodes.append(points[0])

        # Determine if this truck is actually assigned work
        if len(route_nodes) <= 2:
            route_obj = create_route(
                truck_id=active_trucks[vehicle_id]["truck_id"],
                route_nodes=route_nodes,
                estimated_time=0,
                version=old_version + 1
            )
            route_obj["status"] = "inactive"
        else:
            route_obj = create_route(
                truck_id=active_trucks[vehicle_id]["truck_id"],
                route_nodes=route_nodes,
                estimated_time=total_time,
                version=old_version + 1
            )
            route_obj["status"] = "active"

        new_routes.append(route_obj)


    return new_routes
