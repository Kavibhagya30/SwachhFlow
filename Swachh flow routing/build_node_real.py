def build_nodes(sctps, gvps):
    nodes = []

    # Choose first SCTP as depot
    depot = sctps[0]
    nodes.append(depot)

    for gvp in gvps:
        nodes.append(gvp)

    return nodes
