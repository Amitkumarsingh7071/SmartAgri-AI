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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
