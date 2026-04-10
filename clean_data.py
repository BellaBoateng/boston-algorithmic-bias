import pandas as pd
import os
import glob

# Path to your folder with the crime CSV files
data_folder = "Crime-rates"

# Find all CSV files in that folder
csv_files = glob.glob(os.path.join(data_folder, "*.csv"))

# Keep only the year files, not offense_codes2.csv
year_files = []
for file in csv_files:
    filename = os.path.basename(file)
    if filename[:4].isdigit():
        year_files.append(file)

# Read and combine all year files
all_dataframes = []

for file in year_files:
    df = pd.read_csv(file)
    all_dataframes.append(df)

combined_df = pd.concat(all_dataframes, ignore_index=True)

# Keep only rows where DISTRICT is not missing
combined_df = combined_df.dropna(subset=["DISTRICT"])

# Count incidents by district
district_counts = (
    combined_df.groupby("DISTRICT")
    .size()
    .reset_index(name="incident_count")
    .sort_values(by="incident_count", ascending=False)
)

# Save cleaned summary file
output_folder = "cleaned-data"
os.makedirs(output_folder, exist_ok=True)

district_counts.to_csv(os.path.join(output_folder, "district_counts.csv"), index=False)

print("Done! Cleaned file saved to cleaned-data/district_counts.csv")
print(district_counts)