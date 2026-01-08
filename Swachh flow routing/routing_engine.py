from ortools.constraint_solver import routing_enums_pb2
from ortools.constraint_solver import pywrapcp
from route_model import create_route

time_matrix = [
    [0, 6, 10, 12],
    [6, 0, 8, 9],
    [10, 8, 0, 7],
    [12, 9, 7, 0]
]

service_times = [
    0,    # SCTP
    20,   # GVP 1
    25,   # GVP 2
    20    # GVP 3
]

waste = [
    0,    # SCTP
    200,  # GVP 1
    300,  # GVP 2
    150   # GVP 3
]

vehicle_capacity = [500]  # single truck

num_vehicles = 1
depot = 0  # SCTP

manager = pywrapcp.RoutingIndexManager(
    len(time_matrix),
    num_vehicles,
    depot
)

routing = pywrapcp.RoutingModel(manager)

def time_callback(from_index, to_index):
    from_node = manager.IndexToNode(from_index)
    to_node = manager.IndexToNode(to_index)
    return time_matrix[from_node][to_node]

transit_callback_index = routing.RegisterTransitCallback(time_callback)
routing.SetArcCostEvaluatorOfAllVehicles(transit_callback_index)
search_parameters = pywrapcp.DefaultRoutingSearchParameters()
search_parameters.first_solution_strategy = (
    routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC
)

solution = routing.SolveWithParameters(search_parameters)

if solution:
    print("Basic routing works!")

routing.AddDimension(
    transit_callback_index,
    0,          # no slack
    8 * 60,     # 8 hours max
    True,       # start cumul at zero
    "Time"
)

def time_callback(from_index, to_index):
    from_node = manager.IndexToNode(from_index)
    to_node = manager.IndexToNode(to_index)
    travel_time = time_matrix[from_node][to_node]
    service_time = service_times[from_node]
    return travel_time + service_time

def waste_callback(from_index):
    from_node = manager.IndexToNode(from_index)
    return waste[from_node]

waste_callback_index = routing.RegisterUnaryTransitCallback(waste_callback)

if solution:
    for vehicle_id in range(num_vehicles):
        index = routing.Start(vehicle_id)
        route = []
        total_time = 0

        while not routing.IsEnd(index):
            node = manager.IndexToNode(index)
            route.append(node)
            previous_index = index
            index = solution.Value(routing.NextVar(index))
            total_time += routing.GetArcCostForVehicle(
                previous_index, index, vehicle_id
            )

        route.append(manager.IndexToNode(index))

        print({
            "truck_id": vehicle_id,
            "route": route,
            "estimated_time": total_time
        })

route_obj = create_route(
    truck_id=vehicle_id,
    route_nodes=route,
    estimated_time=total_time
)

print(route_obj)
