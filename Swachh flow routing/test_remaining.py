from gvp_status import get_remaining_gvps, get_current_position

route = [0, 1, 3, 2, 0]

gvp_status = {
    1: "cleared",
    3: "cleared",
    2: "partial_high"
}

print("Remaining:", get_remaining_gvps(route, gvp_status))
print("Current position:", get_current_position(route, gvp_status))
