from preprocessing.load_data import load_data
from preprocessing.clean_data import *
from prepare_real_data import prepare_gvps, prepare_sctps
from build_node_real import build_nodes
from time_matrix_real import build_time_matrix
from routing_engine import solve_routing
from routing_engine_real import build_vehicles

# Load
gvps_df, sctps_df, trucks_df = load_data()

# Prepare
gvps = prepare_gvps(gvps_df)
sctps = prepare_sctps(sctps_df)
nodes = build_nodes(sctps, gvps)

# Constraints
time_matrix = build_time_matrix(nodes)
vehicle_capacities = build_vehicles(trucks_df)

# Solve
routes = solve_routing(nodes, time_matrix, vehicle_capacities)

print(routes)
