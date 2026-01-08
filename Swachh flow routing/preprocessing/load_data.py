import pandas as pd

def load_data():
    gvps = pd.read_excel("data/gvps.xlsx")
    sctps = pd.read_excel("data/sctps.xlsx")
    trucks = pd.read_excel("data/trucks.xlsx")

    # 🔥 STANDARDIZE COLUMN NAMES
    gvps = gvps.rename(columns={
        "Latitude": "lat",
        "Longitude": "long",
        "Estimated Waste Generation": "waste_generated",
        "Location of the GVPs": "gvp_name"
    })

    sctps = sctps.rename(columns={
        "latitude": "lat",
        "longitude": "long",
        "Transferstation": "id"
    })

    trucks = trucks.rename(columns={
        "Payload Capacity (in Tonnes)": "capacity",
        "No. of Vehicles Available": "count"
    })

    return gvps, sctps, trucks
