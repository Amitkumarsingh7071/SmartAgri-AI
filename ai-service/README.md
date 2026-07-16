# Smart Agriculture AI Microservice

This is a Python FastAPI microservice that implements machine learning and expert system reasoning for farmer decision support.

## Features
1. **Crop Recommendation**: Machine learning model (Decision Tree) trained on-the-fly using synthetic regional agricultural data.
2. **Fertilizer Advisory**: Expert system rule-engine mapping soil deficits to optimal chemical/organic fertilizers and dosages.
3. **Leaf Disease Diagnosis**: Image analysis heuristic that maps leaf properties deterministically to treatment plans.
4. **AI Chatbot**: Contextual agronomist agent that supports local rule fallbacks and direct Google Gemini API integrations.

## Setup Instructions

### 1. Create virtual environment
```bash
python -m venv venv
venv\Scripts\activate
```

### 2. Install dependencies
```bash
pip install -r requirements.txt
```

### 3. Run AI Service
```bash
python main.py
```
The service will boot up on `http://127.0.0.1:8000`.

### 4. (Optional) Enable Gemini LLM Chat
Create a `.env` file in this directory or set the environment variable:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```
If configured, the chatbot will use the Gemini-Pro model for advanced natural language responses.
