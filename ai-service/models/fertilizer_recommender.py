import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import random

# Encode crop names
crop_mapping = {
    'rice': 0, 'paddy': 0,
    'wheat': 1,
    'cotton': 2,
    'maize': 3, 'corn': 3,
    'legumes': 4, 'pulse': 4, 'beans': 4, 'peas': 4
}

fertilizer_classes = [
    "Urea (46% Nitrogen)",
    "Di-Ammonium Phosphate (DAP)",
    "Muriate of Potash (MOP)",
    "Single Super Phosphate (SSP)",
    "Agricultural Lime (Calcium Carbonate)",
    "Gypsum (Calcium Sulfate)",
    "NPK 19-19-19 (Balanced Fertilizer)"
]

# Generate synthetic dataset for fertilizer recommendation training
# Columns: [crop_idx, N, P, K, pH, moisture, fertilizer_label]
def generate_fertilizer_dataset():
    data = []
    
    for _ in range(800):
        crop_idx = random.randint(0, 4)
        N = random.uniform(10, 200)
        P = random.uniform(5, 100)
        K = random.uniform(10, 350)
        pH = random.uniform(4.5, 8.5)
        moisture = random.uniform(10, 80)
        
        # Heuristics to label the training data
        if pH < 5.8:
            fert = "Agricultural Lime (Calcium Carbonate)"
        elif pH > 7.8:
            fert = "Gypsum (Calcium Sulfate)"
        elif N < 80:
            fert = "Urea (46% Nitrogen)"
        elif P < 35:
            # SSP is preferred for rice and legumes (contains sulfur)
            if crop_idx == 0 or crop_idx == 4:
                fert = "Single Super Phosphate (SSP)"
            else:
                fert = "Di-Ammonium Phosphate (DAP)"
        elif K < 130:
            fert = "Muriate of Potash (MOP)"
        else:
            fert = "NPK 19-19-19 (Balanced Fertilizer)"
            
        data.append([crop_idx, N, P, K, pH, moisture, fert])
        
    df = pd.DataFrame(data, columns=['crop_idx', 'N', 'P', 'K', 'pH', 'moisture', 'fertilizer'])
    return df

# Train Fertilizer ML Model
print("Training Fertilizer Recommendation Model...")
df = generate_fertilizer_dataset()
X = df[['crop_idx', 'N', 'P', 'K', 'pH', 'moisture']]
y = df['fertilizer']

fertilizer_model = RandomForestClassifier(n_estimators=50, random_state=42)
fertilizer_model.fit(X, y)
print("Fertilizer Recommendation Model trained successfully.")

# Map fertilizers to dosage instructions & agronomic explanations
fertilizer_details = {
    "Urea (46% Nitrogen)": {
        "quantity": "55 kg/Acre",
        "method": "Top dressing in two split doses during tillering/squaring stages.",
        "reason": "Nitrogen levels are low. Urea stimulates rapid vegetative growth, tillering, and healthy foliage."
    },
    "Di-Ammonium Phosphate (DAP)": {
        "quantity": "45 kg/Acre",
        "method": "Basal placement (deep in soil near root zone during sowing).",
        "reason": "Phosphorus deficiency detected. DAP provides starter nitrogen and high soluble phosphate for early root branching."
    },
    "Muriate of Potash (MOP)": {
        "quantity": "25 kg/Acre",
        "method": "Broadcasting evenly, mixed with organic manure before sowing.",
        "reason": "Potassium deficiency detected. Potash boosts crop disease resistance, lodging prevention, and starch content."
    },
    "Single Super Phosphate (SSP)": {
        "quantity": "60 kg/Acre",
        "method": "Incorporated into mud during final puddling or land preparation.",
        "reason": "Phosphorus deficiency in sulfur-sensitive crop. SSP provides phosphate, calcium, and sulfur to boost seed pod counts."
    },
    "Agricultural Lime (Calcium Carbonate)": {
        "quantity": "200 kg/Acre",
        "method": "Broadcast and disk-mix into soil 3-4 weeks prior to planting.",
        "reason": "Soil pH is highly acidic. Lime raises pH, neutralizing toxic aluminum and unlocking locked soil nutrients."
    },
    "Gypsum (Calcium Sulfate)": {
        "quantity": "150 kg/Acre",
        "method": "Soil incorporation after primary tillage.",
        "reason": "Soil pH is highly alkaline. Gypsum reduces sodicity, improves soil structure, and supplies calcium."
    },
    "NPK 19-19-19 (Balanced Fertilizer)": {
        "quantity": "15 kg/Acre",
        "method": "Foliar spray or fertigation (drip injection) during growth spikes.",
        "reason": "Soil chemistry is balanced. NPK 19-19-19 maintains general crop health and vigor."
    }
}

def get_fertilizer_recommendation(crop_name, N, P, K, pH, moisture):
    crop_lower = crop_name.lower()
    
    # Get crop index fallback to 3 (Maize/General)
    crop_idx = crop_mapping.get(crop_lower, 3)
    
    # Features shape
    features = np.array([[crop_idx, N, P, K, pH, moisture]])
    
    # Predict
    prediction = fertilizer_model.predict(features)[0]
    
    # Lookup instructions
    details = fertilizer_details.get(prediction, fertilizer_details["NPK 19-19-19 (Balanced Fertilizer)"])
    
    return {
        "crop_name": crop_name,
        "recommended_fertilizer": prediction,
        "quantity_kg_acre": details["quantity"],
        "application_method": details["method"],
        "reasoning": f"ML Model Prediction: {details['reason']}"
    }
