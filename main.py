import pickle
import numpy as np
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os

# Define the input data model for the API
class PredictionRequest(BaseModel):
    team1: str
    team2: str
    venue: str

# Define the response data model for the API
class PredictionResponse(BaseModel):
    predictedScore: float

app = FastAPI(title="IPL Score Predictor API")

# Add CORS middleware to allow cross-origin requests from your frontend
origins = [
    "http://localhost:8080",  # Your frontend's development URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the trained model and data transformers once on startup
try:
    with open('model/score_prediction_model.pkl', 'rb') as f:
        model = pickle.load(f)
    with open('model/data_encoder.pkl', 'rb') as f:
        data_encoder = pickle.load(f)
except FileNotFoundError:
    raise RuntimeError("Model files not found. Please ensure 'score_prediction_model.pkl' and 'data_encoder.pkl' are in the 'model' directory.")
except Exception as e:
    raise RuntimeError(f"Error loading model files: {e}")

@app.get("/")
def read_root():
    return {"message": "Welcome to the IPL Score Predictor API!"}

@app.post("/predict", response_model=PredictionResponse)
def predict_score(request: PredictionRequest):
    """
    Predicts the final score of an IPL match based on the provided teams and venue.
    """
    
    # Create a DataFrame from the request data to match the training data format
    input_df = pd.DataFrame([[request.team1, request.team2, request.venue]],
                            columns=['batting_team', 'bowling_team', 'venue'])
    
    # Use the loaded encoder to transform the input data
    try:
        encoded_input = data_encoder.transform(input_df).toarray()
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Invalid team or venue selected: {e}")
    
    # Make a prediction using the loaded model
    predicted_score = model.predict(encoded_input)[0]
    
    # Return the prediction as a response
    return PredictionResponse(predictedScore=round(predicted_score))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)