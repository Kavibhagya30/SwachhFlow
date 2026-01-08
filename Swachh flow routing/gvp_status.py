def get_remaining_gvps(route, gvp_status):
    """
    route: [0, 1, 3, 2, 0]
    gvp_status: {
        1: "cleared",
        2: "partial_high",
        3: "cleared"
    }
    """
    remaining = []

    for node in route:
        if node == 0:
            continue  # depot
        status = gvp_status.get(node, "pending")
        if status != "cleared":
            remaining.append(node)

    return remaining
def get_current_position(route, gvp_status):
    for node in route:
        if node == 0:
            continue
        if gvp_status.get(node) != "cleared":
            return node
    return 0  # back to depot if all cleared
