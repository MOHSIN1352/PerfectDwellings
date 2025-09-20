import pandas as pd
import joblib
import matplotlib.pyplot as plt
import numpy as np

print("🚀 Starting AI Model Visualization for the Advanced Pipeline...")

# --- 1. Visualize the Price Prediction Pipeline (XGBoost) ---
print("\n--- Visualizing Price Prediction Model ---")
try:
    # Load the entire pipeline object
    pipeline = joblib.load('price_prediction_pipeline.joblib')

    # Extract the individual steps from the pipeline
    preprocessor = pipeline.named_steps['preprocessor']
    model = pipeline.named_steps['regressor']

    # Correctly get feature names AFTER one-hot encoding
    cat_features_encoded = preprocessor.named_transformers_['cat'].get_feature_names_out()
    num_features = pipeline.named_steps['preprocessor'].transformers_[0][2]
    all_feature_names = list(num_features) + list(cat_features_encoded)

    # Get the importance scores from the model
    feature_importances = pd.Series(model.feature_importances_, index=all_feature_names)
    
    plt.figure(figsize=(12, 8))
    feature_importances.nlargest(15).sort_values().plot(kind='barh') # Show top 15
    plt.title('Top 15 Most Important Features for Price Prediction (Advanced Model)')
    plt.xlabel('Importance Score (%)')
    plt.tight_layout()
    
    plt.savefig('price_model_feature_importance.png')
    print("✅ Saved 'price_model_feature_importance.png'")

except FileNotFoundError:
    print("❌ Could not find 'price_prediction_pipeline.joblib'. Please run the advanced trainer first.")
except Exception as e:
    print(f"An error occurred: {e}")

# --- 2. Visualize the Neighborhood Scoring Model ---
print("\n--- Visualizing Neighborhood Scoring Model ---")
try:
    scores_dict = joblib.load('neighborhood_scores.joblib')
    df_scores = pd.DataFrame.from_dict(scores_dict, orient='index')
    sample_localities = df_scores.sample(3, random_state=42).index.tolist()
    print(f"Generating Radar Charts for: {', '.join(sample_localities)}")

    labels = ['Family', 'Health', 'Connectivity']
    num_vars = len(labels)
    angles = np.linspace(0, 2 * np.pi, num_vars, endpoint=False).tolist()
    angles += angles[:1]

    fig, ax = plt.subplots(figsize=(8, 8), subplot_kw=dict(polar=True))

    for locality in sample_localities:
        values = df_scores.loc[locality, ['Family_Score', 'Health_Score', 'Connectivity_Score']].tolist()
        values += values[:1]
        ax.plot(angles, values, label=locality)
        ax.fill(angles, values, alpha=0.25)

    ax.set_yticklabels([])
    ax.set_xticks(angles[:-1])
    ax.set_xticklabels(labels)
    plt.title('Lifestyle Score Comparison for Sample Neighborhoods', size=15, y=1.1)
    plt.legend(loc='upper right', bbox_to_anchor=(1.3, 1.1))

    plt.savefig('neighborhood_scores_radar_chart.png')
    print("✅ Saved 'neighborhood_scores_radar_chart.png'")

except FileNotFoundError:
    print("❌ Could not find neighborhood scores file. Please run the analyzer first.")
except Exception as e:
    print(f"An error occurred: {e}")

print("\n🏆 Visualization script finished.")