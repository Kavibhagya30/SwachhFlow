from utils.geo_utils import dms_to_decimal

def prepare_gvps(gvps_df):
    gvps = []
    for _, row in gvps_df.iterrows():
        gvps.append({
            "id": row["Location of the GVPs"],
            "lat": float(row["Latitude"]),
            "lng": float(row["Longitude"]),
            "demand": int(row["Estimated Waste Generation"] * 1000)  # tonnes → kg
        })
    return gvps


def prepare_sctps(sctps_df):
    sctps = []
    for _, row in sctps_df.iterrows():
        sctps.append({
            "id": row["Transferstation"],
            "lat": dms_to_decimal(row["latitude"]),
            "lng": dms_to_decimal(row["longitude"]),
            "demand": 0
        })
    return sctps
