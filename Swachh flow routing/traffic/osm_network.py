import osmnx as ox

def load_hyderabad_graph():
    G = ox.graph_from_place(
        "Hyderabad, India",
        network_type="drive",
        simplify=True
    )

    # 🚀 CRITICAL STEP
    G = ox.project_graph(G)

    return G
