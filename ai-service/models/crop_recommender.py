import numpy as np
import pandas as pd
from sklearn.tree import DecisionTreeClassifier
import random

# Generate synthetic dataset for crop recommendation
def generate_dataset():
    crops = ['Rice', 'Maize', 'Cotton', 'Wheat', 'Legumes']
    data = []
    
    # Ranges: [min_N, max_N, min_P, max_P, min_K, max_K, min_pH, max_pH, min_temp, max_temp, min_hum, max_hum, min_rain, max_rain]
    ranges = {
        'Rice': [70, 100, 35, 55, 30, 50, 5.5, 6.5, 22, 32, 75, 90, 180, 250],
        'Maize': [60, 90, 40, 55, 35, 50, 5.8, 7.0, 18, 28, 60, 75, 75, 120],
        'Cotton': [90, 130, 45, 60, 130, 170, 6.0, 7.8, 24, 35, 50, 65, 50, 90],
        'Wheat': [80, 110, 40, 55, 140, 180, 6.0, 7.2, 12, 24, 55, 70, 40, 75],
        'Legumes': [15, 35, 35, 50, 20, 40, 6.0, 7.0, 20, 28, 50, 65, 35, 65]
    }
    
    for crop, r in ranges.items():
        for _ in range(150): # 150 samples per crop
            N = random.uniform(r[0], r[1])
            P = random.uniform(r[2], r[3])
            K = random.uniform(r[4], r[5])
            pH = random.uniform(r[6], r[7])
            temp = random.uniform(r[8], r[9])
            hum = random.uniform(r[10], r[11])
            rain = random.uniform(r[12], r[13])
            data.append([N, P, K, pH, temp, hum, rain, crop])
            
    df = pd.DataFrame(data, columns=['N', 'P', 'K', 'pH', 'temperature', 'humidity', 'rainfall', 'crop'])
    return df

# Initialize and train the model on startup
print("Training Crop Recommendation Model...")
df = generate_dataset()
X = df[['N', 'P', 'K', 'pH', 'temperature', 'humidity', 'rainfall']]
y = df['crop']

model = DecisionTreeClassifier(random_state=42)
model.fit(X, y)
print("Crop Recommendation Model trained successfully.")

def get_crop_recommendation(N, P, K, pH, temp, humidity, rainfall):
    features = np.array([[N, P, K, pH, temp, humidity, rainfall]])
    prediction = model.predict(features)[0]
    probabilities = model.predict_proba(features)[0]
    
    # Get the confidence score for the predicted crop
    class_index = list(model.classes_).index(prediction)
    confidence = float(probabilities[class_index])
    
    # Context-specific reasoning & yield estimates
    details = {
        'Rice': {
            'reason': 'Highly suitable due to heavy rainfall and high humidity. Your soil pH is excellent for aquatic nutrient absorption.',
            'yield': '2.2 - 3.5 Tons/Acre',
            'mandi_est': 'High demand in state grain markets.'
        },
        'Maize': {
            'reason': 'Moderate rainfall and warm temp favor maize growth. Nitrogen levels are sufficient for root and leaf development.',
            'yield': '1.8 - 2.6 Tons/Acre',
            'mandi_est': 'Excellent for livestock feed markets.'
        },
        'Cotton': {
            'reason': 'Thrives in black/loamy soil under warm climates. High Potassium and moderate rainfall will maximize fiber quality.',
            'yield': '0.8 - 1.4 Tons/Acre',
            'mandi_est': 'Cash crop with high textile industrial demand.'
        },
        'Wheat': {
            'reason': 'Optimal winter crop conditions with moderate moisture. Adequate Potassium and neutral pH supports high grain count.',
            'yield': '1.5 - 2.2 Tons/Acre',
            'mandi_est': 'Favorable procurement rates from government mandis.'
        },
        'Legumes': {
            'reason': 'Low Nitrogen levels suggest legumes, which fix nitrogen biologically. Requires minimal water and enriches soil carbon.',
            'yield': '0.6 - 1.1 Tons/Acre',
            'mandi_est': 'High local market value and fast rotations.'
        }
    }
    
    info = details.get(prediction, {
        'reason': 'Recommended based on overall soil chemistry suitability metrics.',
        'yield': '1.0 - 2.0 Tons/Acre',
        'mandi_est': 'Steady market demand.'
    })
    
    return {
        'recommended_crop': prediction,
        'confidence': round(confidence * 100, 1),
        'reason': info['reason'],
        'expected_yield': info['yield'],
        'market_outlook': info['mandi_est']
    }
