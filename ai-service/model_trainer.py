import pandas as pd
from sklearn.model_selection import train_test_split
import xgboost as xgb  # Import the new library
import joblib

print(" Starting ADVANCED model training process with XGBoost...")

# --- 1. Load the Dataset ---
print("Loading 'india_housing_prices.csv'...")
df = pd.read_csv('india_housing_prices.csv')

# --- 2. Feature Selection ---
features_to_use = [
    'BHK',
    'Size_in_SqFt',
    'Total_Floors',
    'Age_of_Property',
    'Parking_Space',
    'Furnished_Status',
    'Price_per_SqFt',
    'Price_in_Lakhs'
]
df_selected = df[features_to_use]
print(f"Selected {len(features_to_use)} features. Initial shape: {df_selected.shape}")

# --- 3. Data Cleaning and Preparation ---
df_cleaned = df_selected.dropna()
df_cleaned['Price'] = df_cleaned['Price_in_Lakhs'] * 100000
df_cleaned['Parking'] = df_cleaned['Parking_Space'].apply(lambda x: 1 if x == 'Yes' else 0)
print(f"Data cleaned. Shape after dropping missing values: {df_cleaned.shape}")

# --- 4. One-Hot Encoding for 'Furnished_Status' ---
print("Applying One-Hot Encoding to 'Furnished_Status'...")
df_encoded = pd.get_dummies(df_cleaned, columns=['Furnished_Status'], drop_first=True)

# --- 5. Define Final Features (X) and Target (y) ---
X = df_encoded.drop(['Price_in_Lakhs', 'Price', 'Parking_Space'], axis=1)
y = df_encoded['Price']

# --- 6. Split Data for Training and Testing ---
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
print("Data split into training (80%) and testing (20%) sets.")

# --- 7. Train the XGBoost Regressor Model ---
print("Training the XGBoost Regressor model... This will be more intensive.")
# We initialize the XGBoost model. These parameters are a good starting point.
model = xgb.XGBRegressor(n_estimators=1000, learning_rate=0.05, n_jobs=-1, random_state=42)
model.fit(X_train, y_train)

# --- 8. Evaluate Model Performance ---
accuracy = model.score(X_test, y_test)
print(f"Model training complete. Accuracy (R-squared score): {accuracy:.3f}")

# --- 9. Save the Model and Columns ---
print("Saving the advanced model and column list to files...")
# We overwrite the old model files with this new, more powerful version.
joblib.dump(model, 'price_prediction_model.joblib')
joblib.dump(X.columns.tolist(), 'model_columns.joblib')

print("🏆 Advanced model training successful. Your AI is now smarter!")
