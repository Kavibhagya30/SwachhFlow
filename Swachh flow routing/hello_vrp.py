from ortools.constraint_solver import routing_enums_pb2
from ortools.constraint_solver import pywrapcp

def main():
    manager = pywrapcp.RoutingIndexManager(5, 1, 0)
    routing = pywrapcp.RoutingModel(manager)

    def distance_callback(from_index, to_index):
        return abs(from_index - to_index)

    transit_callback_index = routing.RegisterTransitCallback(distance_callback)
    routing.SetArcCostEvaluatorOfAllVehicles(transit_callback_index)

    search_parameters = pywrapcp.DefaultRoutingSearchParameters()
    search_parameters.first_solution_strategy = (
        routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC)

    solution = routing.SolveWithParameters(search_parameters)

    if solution:
        print("OR-Tools is working!")

if __name__ == "__main__":
    main()
