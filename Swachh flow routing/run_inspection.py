from preprocessing.load_data import load_data
from preprocessing.clean_data import clean_gvps, clean_sctps, clean_trucks

gvps, sctps, trucks = load_data()

gvps = clean_gvps(gvps)
sctps = clean_sctps(sctps)
trucks = clean_trucks(trucks)

print("GVP count:", len(gvps))
print("Total waste (kg):", gvps["waste_generated"].sum())
print("SCTP count:", len(sctps))
print("Total trucks:", trucks["count"].sum())
