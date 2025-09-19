from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd

app = Flask(__name__)
CORS(app)

# --- Load the final trained model and its column list ---
print("Loading model and columns...")
model = joblib.load('price_prediction_model.joblib')
model_columns = joblib.load('model_columns.joblib')
print("Model and columns loaded successfully.")

@app.route('/predict_price', methods=['POST'])
def predict_price():
    try:
        # 1. Get JSON data from the React app
        data = request.get_json()
        print(f"Received data: {data}")

        # 2. Create a DataFrame from the incoming data
        # The keys here MUST match the column names from the training CSV
        query_df = pd.DataFrame([{
            'BHK': data.get('bedrooms'),
            'Size_in_SqFt': data.get('size'),
            'Total_Floors': data.get('totalFloors'),
            'Age_of_Property': data.get('age'),
            'Price_per_SqFt': data.get('pricePerSqFt'),
            'Parking_Space': 'Yes' if data.get('parking') else 'No',
            'Furnished_Status': data.get('furnishedStatus')
        }])
        
        # 3. Perform One-Hot Encoding on the single row
        # This MUST match the encoding from the training script
        categorical_cols = ['Furnished_Status'] # City and Property_Type are handled by Price_per_SqFt now
        query_encoded = pd.get_dummies(query_df, columns=categorical_cols)

        # 4. Align columns with the trained model's columns
        # This is the most critical step for preventing errors.
        # It adds any missing columns from the training set and fills them with 0.
        query_aligned = query_encoded.reindex(columns=model_columns, fill_value=0)
        
        print("Data processed and aligned for prediction.")
        
        # 5. Make a prediction
        prediction = model.predict(query_aligned)

        # 6. Return the prediction in a JSON format
        return jsonify({'predicted_price': int(prediction[0])})

    except Exception as e:
        print(f"An error occurred: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)