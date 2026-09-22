from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import hashlib
import random
import os
import httpx
from typing import List, Optional

# Import models
from models.crop_recommender import get_crop_recommendation
from models.fertilizer_recommender import get_fertilizer_recommendation
from models.disease_detector import predict_leaf_disease

app = FastAPI(title="Smart Agriculture AI Microservice")

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request schemas
class CropRequest(BaseModel):
    N: float
    P: float
    K: float
    pH: float
    temperature: float
    humidity: float
    rainfall: float

class FertilizerRequest(BaseModel):
    crop_name: str
    N: float
    P: float
    K: float
    pH: float
    moisture: float

class ChatMessage(BaseModel):
    role: str # 'user' or 'assistant'
    content: str

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[ChatMessage]] = []

@app.get("/")
def read_root():
    return {"status": "running", "service": "Smart Agriculture AI Microservice"}

# 1. Crop Recommendation
@app.post("/api/recommend-crop")
def get_crop_rec(req: CropRequest):
    try:
        result = get_crop_recommendation(
            req.N, req.P, req.K, req.pH, req.temperature, req.humidity, req.rainfall
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 2. Fertilizer Recommendation
@app.post("/api/recommend-fertilizer")
def get_fert_rec(req: FertilizerRequest):
    try:
        result = get_fertilizer_recommendation(
            req.crop_name, req.N, req.P, req.K, req.pH, req.moisture
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 3. Plant Disease Detection (Random Forest Leaf Classifier)
@app.post("/api/detect-disease")
async def detect_leaf_disease(image: UploadFile = File(...)):
    try:
        contents = await image.read()
        result = predict_leaf_disease(contents)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 4. AI Chat Assistant (with Gemini API integration fallback)
@app.post("/api/chat")
async def chat_assistant(req: ChatRequest):
    message_lower = req.message.lower()
    
    # Try Gemini API if key is available in environment
    gemini_key = os.environ.get("GEMINI_API_KEY")
    if gemini_key:
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={gemini_key}"
            
            # Format chat history for Gemini
            contents = []
            for msg in req.history:
                role = "user" if msg.role == "user" else "model"
                contents.append({"role": role, "parts": [{"text": msg.content}]})
            
            # Append current message
            contents.append({"role": "user", "parts": [{"text": f"You are an expert agronomist and farming assistant. Answer this farming question: {req.message}"}]})
            
            payload = {"contents": contents}
            
            async with httpx.AsyncClient() as client:
                response = await client.post(url, json=payload, timeout=10.0)
                if response.status_code == 200:
                    res_json = response.json()
                    ai_reply = res_json['candidates'][0]['content']['parts'][0]['text']
                    return {"response": ai_reply}
        except Exception as err:
            print("Gemini API Error, falling back to rule-based system:", err)

    # --- Rule-Based Agricultural Expert System Fallback ---
    response = "I am your Smart Agri AI Assistant. Ask me about crop suitability, leaf disease treatments, NPK soil deficits, or market pricing strategies!"

    if "yellow" in message_lower and ("leaf" in message_lower or "leaves" in message_lower):
        response = (
            "Yellow leaves (Chlorosis) are usually a sign of:\n\n"
            "1. **Nitrogen Deficiency**: The oldest leaves turn yellow first. Solution: Apply Urea or organic compost.\n"
            "2. **Overwatering/Poor Drainage**: Roots suffocating. Solution: Check soil drainage and reduce water frequency.\n"
            "3. **Early Blight**: Look for dark spots with concentric rings. Solution: Spray copper fungicides or Bacillus subtilis."
        )
    elif "black soil" in message_lower:
        response = (
            "Black Soil (also known as Regur or Cotton Soil) is rich in Calcium, Carbonate, Magnesium, and Potash, but low in Nitrogen.\n\n"
            "**Best Crops for Black Soil**:\n"
            "• **Cotton** (Best suited due to high water-retention capacity)\n"
            "• **Wheat** (Favorable winter crop)\n"
            "• **Soybean / Groundnuts**\n"
            "• **Linseed & Citrus fruits**"
        )
    elif "irrigate" in message_lower or "watering" in message_lower or "water" in message_lower:
        response = (
            "Irrigation schedules depend heavily on your crop type and growth stage:\n\n"
            "• **Wheat**: Requires critical irrigation during *Crown Root Initiation* (20-25 days post-sowing) and *Flowering* stages.\n"
            "• **Rice**: Paddies require standing water (2-5 cm) from transplanting up to the grain filling stage.\n"
            "• **Cotton**: Extremely sensitive to logging. Drip irrigation is highly recommended, watering during flower squaring.\n\n"
            "Tip: You can log soil moisture levels in our **Soil Health** module to track watering requirements."
        )
    elif "pest" in message_lower or "insect" in message_lower or "bug" in message_lower:
        response = (
            "For general pest control, consider these solutions:\n\n"
            "• **Organic**: Apply Neem Oil Spray (concentration: 1500 ppm) mixed with a few drops of dish soap. Spray during late evening to avoid burning foliage.\n"
            "• **Biological**: Introduce ladybugs or lacewings to control aphids and mites.\n"
            "• **Chemical**: For severe thrips or bollworm attacks, consult your local Krishi Vigyan Kendra (KVK) for specific insecticide dosages (e.g. Imidacloprid)."
        )
    elif "mandi" in message_lower or "price" in message_lower:
        response = (
            "You can track daily market prices directly in the **Market Prices** tab. "
            "Use the **Profit Estimator** inside the pricing tab to type your yield weight and production costs—the system will tell you the highest paying mandi to sell your harvest!"
        )
    elif "fertilizer" in message_lower or "npk" in message_lower:
        response = (
            "To get an AI Fertilizer Recommendation, navigate to our **AI Studio** and fill in the Fertilizer Recommendation form with your crop name and soil sensor telemetry (NPK values).\n\n"
            "General Rule: Nitrogen (N) is for leafy growth, Phosphorus (P) is for roots and flowers, and Potassium (K) is for disease resistance and fruit quality."
        )

    return {"response": response}

class VoiceRequest(BaseModel):
    query: str
    lang: Optional[str] = "en"
    crop_name: Optional[str] = "Tomato"
    crop_age_days: Optional[int] = 45
    farm_area: Optional[float] = 2.0

class PricePredictRequest(BaseModel):
    crop_name: str

class NdviRequest(BaseModel):
    lat: Optional[float] = 28.6139
    lon: Optional[float] = 77.2090
    crop_name: Optional[str] = "Tomato"

@app.post("/api/ndvi-analyzer")
def analyze_ndvi_satellite(req: NdviRequest):
    ndvi_score = round(random.uniform(0.62, 0.76), 2)
    vigor_pct = int(ndvi_score * 100)
    
    return {
        "success": True,
        "lat": req.lat,
        "lon": req.lon,
        "crop_name": req.crop_name,
        "ndvi_score": ndvi_score,
        "vigor_percentage": f"{vigor_pct}%",
        "water_stress_index": "Low Risk",
        "health_status": "HEALTHY_CANOPY",
        "grid_zones": [
            {"zone": "North Sector", "ndvi": round(ndvi_score + 0.05, 2), "status": "Optimal Vigor", "color": "#10B981"},
            {"zone": "Center Sector", "ndvi": ndvi_score, "status": "Healthy Canopy", "color": "#3B82F6"},
            {"zone": "South Sector", "ndvi": round(ndvi_score - 0.12, 2), "status": "Moderate Moisture Stress", "color": "#F59E0B"}
        ]
    }

@app.post("/api/predict-price-trend")
def predict_price_trend(req: PricePredictRequest):
    crop = req.crop_name.lower()
    base_price = 2800.0 if "tomato" in crop else (2250.0 if "wheat" in crop else (6200.0 if "cotton" in crop else 2100.0))
    
    # Generate 30-day forecasting curve
    points = []
    current = base_price
    peak_day = 12
    peak_price = base_price * 1.18
    
    for day in range(1, 31):
        if day <= peak_day:
            current += random.uniform(15, 35)
        else:
            current -= random.uniform(10, 25)
            
        points.append({
            "day": f"Day {day}",
            "price": round(current, 1)
        })
        
    return {
        "success": True,
        "crop_name": req.crop_name,
        "current_price": base_price,
        "expected_peak_price": round(peak_price, 1),
        "best_sell_day": f"Day {peak_day}",
        "trend_direction": "RISING_PEAK",
        "recommendation": f"Market Analysis: Prices for {req.crop_name} are projected to rise over the next 12 days before leveling off. Consider holding harvest for 10-14 days to maximize profit.",
        "forecast_30d": points
    }

@app.post("/api/voice-query")
def voice_assistant_query(req: VoiceRequest):
    q_lower = req.query.lower()
    lang = req.lang or "en"
    
    if "water" in q_lower or "irrigate" in q_lower or "पाणी" in q_lower or "सिंचाई" in q_lower:
        if lang == "hi":
            res = f"आपकी {req.crop_name} फसल ({req.crop_age_days} दिन पुरानी) के लिए: यदि वर्षा की संभावना 60% से अधिक है, तो सिंचाई न करें। धूप में सुबह ड्रिप सिंचाई करें।"
        elif lang == "mr":
            res = f"तुमच्या {req.crop_name} पिकासाठी ({req.crop_age_days} दिवस): पाऊस पडणार असल्यास पाणी देणे टाळा. उष्णतेमध्ये सकाळी ठिबक सिंचन करा."
        else:
            res = f"For your {req.crop_name} crop ({req.crop_age_days} days old on {req.farm_area} Acres): Avoid overhead watering if heavy rain is expected. Use early morning drip irrigation."
    elif "fertilizer" in q_lower or "khad" in q_lower or "खत" in q_lower or "खाद" in q_lower:
        if lang == "hi":
            res = f"आपकी {req.crop_name} फसल के लिए: नीम लेपित यूरिया का उपयोग करें और फास्फोरस के लिए DAP का उपयोग करें।"
        elif lang == "mr":
            res = f"तुमच्या {req.crop_name} पिकासाठी: कडुनिंब लेपित युरिया आणि स्फुरदासाठी DAP खत वापरा."
        else:
            res = f"For your {req.crop_name} crop ({req.crop_age_days} days old): Apply Neem Coated Urea in split doses. Ensure balanced NPK ratios."
    else:
        if lang == "hi":
            res = f"स्मार्टएग्री एआई कृषि सहायक: अपनी {req.crop_name} फसल की सुरक्षा के लिए दैनिक मौसम अलर्ट और पत्तियों की जांच करें।"
        elif lang == "mr":
            res = f"स्मार्टॲग्री एआय कृषी सल्लागार: तुमच्या {req.crop_name} पिकाच्या संरक्षणासाठी हवामान अलर्ट तपासा."
        else:
            res = f"SmartAgri AI Assistant: Monitoring your {req.crop_name} crop ({req.crop_age_days} days old). Check daily weather alerts and leaf diagnostics."
            
    return {
        "success": True,
        "query": req.query,
        "lang": lang,
        "response": res
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
