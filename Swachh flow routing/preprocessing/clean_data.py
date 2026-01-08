import re

def clean_gvps(gvps):
    gvps = gvps.dropna(subset=["lat", "long", "waste_generated"])

    gvps = gvps.copy()
    gvps.loc[:, "lat"] = gvps["lat"].astype(float)
    gvps.loc[:, "long"] = gvps["long"].astype(float)
    gvps.loc[:, "waste_generated"] = gvps["waste_generated"].astype(float)

    # 🚨 REMOVE INVALID COORDINATES
    gvps = gvps[(gvps["lat"] != 0) & (gvps["long"] != 0)]

    # REMOVE NEGATIVE OR ZERO WASTE
    gvps = gvps[gvps["waste_generated"] > 0]

    return gvps


def clean_sctps(sctps):
    sctps = sctps.dropna(subset=["lat", "long"])
    sctps["lat"] = sctps["lat"].astype(float)
    sctps["long"] = sctps["long"].astype(float)

    sctps = sctps[(sctps["lat"] != 0) & (sctps["long"] != 0)]
    sctps.loc[:, "lat"] = sctps["lat"].astype(float)
    sctps.loc[:, "long"] = sctps["long"].astype(float)
    return sctps


def clean_trucks(trucks):
    return trucks.dropna(subset=["capacity", "count"])
