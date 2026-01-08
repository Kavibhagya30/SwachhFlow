import networkx as nx
import numpy as np

def build_traffic_time_matrix(G, road_nodes):
    n = len(road_nodes)
    matrix = np.zeros((n, n), dtype=int)

    for i in range(n):
        for j in range(n):
            if i == j:
                matrix[i][j] = 0
                continue

            try:
                from_node = road_nodes[i]["osmid"]
                to_node = road_nodes[j]["osmid"]
                time = nx.shortest_path_length(
                    G,
                    from_node,
                    to_node,
                    weight="travel_time"
                )
                
                matrix[i][j] = int(time)
            except:
                matrix[i][j] = 300  # unreachable penalty
            time = max(int(time / 1000 * 3), 1) 

    return matrix.tolist()
