import pandas as pd
import joblib
import numpy as np # type: ignore

print("Load the data")
df = pd.read_csv('india_housing_prices.csv')

features =[
    'Locality',
    'Nearby_Schools',
    'Nearby_Hospitals',
    'Public_Transport_Accessibility',
    'Amenities'
]

df_selected = df[features].dropna()
print(f"Data loaded and cleaned. Analyzing {len(df_selected['Locality'].unique())} unique localities.")

def calculate_connectivity_score(value):
    if value == 'High':
        return np.random.uniform(8,10) #high score
    elif value == 'Medium':
        return np.random.uniform(5,7.5) #medium score
    else:
        return np.random.uniform(2, 4.5) #low score
    
df_selected['Connectivity_Score'] = df_selected['Public_Transport_Accessibility'].apply(calculate_connectivity_score)

#family score
def calculate_family_score(row):
    school_score = min(row['Nearby_Schools']/10, 1) * 5
    amenity_score = 0
    if 'Playground' in row['Amenities']:
        amenity_score += 2.5
    if 'Garden' in row['Amenities']:
        amenity_score += 2.5
    return school_score + amenity_score #max score out of 10

df_selected['Family_Score'] = df_selected.apply(calculate_family_score, axis=1)

def calculate_health_score(row):
    hospital_score = min(row['Nearby_Hospitals']/10 ,1) * 5
    amenity_score = 0
    if 'Gym' in row['Amenities']:
        amenity_score += 2.5
    if 'Pool' in row['Amenities']:
        amenity_score += 2.5

    return hospital_score + amenity_score

df_selected['Health_Score'] = df_selected.apply(calculate_health_score, axis=1)

print("Aggregating the scores ")
locality_scores = df_selected.groupby('Locality').agg({
    'Connectivity_Score' : 'mean',
    'Family_Score' : 'mean',
    'Health_Score' : 'mean'
}).reset_index()

scores_dict = locality_scores.set_index('Locality').to_dict('index')

print("Analysis done")
joblib.dump(scores_dict, 'neighborhood_scores.joblib')



