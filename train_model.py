# -*- coding: utf-8 -*-
"""
IPL Score Prediction Model Training Script (Optimized for local use)
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score
import pickle
import os

def load_data(file_path: str):
    """Loads the dataset from the given file path."""
    try:
        data = pd.read_csv(file_path)
        print(f"Dataset successfully imported with shape: {data.shape}")
        return data
    except FileNotFoundError:
        print(f"Error: The file '{file_path}' was not found.")
        return None

def preprocess_data(data: pd.DataFrame):
    """
    Cleans and preprocesses the dataset for model training.
    """
    # Dropping irrelevant columns
    irrelevant_cols = ['mid', 'batsman', 'bowler', 'striker', 'non-striker', 'date']
    data.drop(labels=irrelevant_cols, axis=1, inplace=True)
    
    # Keeping only relevant teams
    consistent_teams = ['Kolkata Knight Riders', 'Chennai Super Kings', 'Rajasthan Royals',
                        'Mumbai Indians', 'Kings XI Punjab', 'Royal Challengers Bangalore',
                        'Delhi Daredevils', 'Sunrisers Hyderabad', 'Deccan Chargers',
                        'Rising Pune Supergiant', 'Gujarat Lions', 'Rising Pune Supergiants',
                        'Kochi Tuskers Kerala', 'Delhi Capitals', 'Gujarat Titans',
                        'Lucknow Super Giants', 'Pune Warriors']
    
    data = data[(data['batting_team'].isin(consistent_teams)) & 
                (data['bowling_team'].isin(consistent_teams))]
    
    # One-Hot Encoding for categorical features
    encoder = OneHotEncoder(handle_unknown='ignore')
    encoded_features = encoder.fit_transform(data[['batting_team', 'bowling_team', 'venue']]).toarray()
    
    # Extract the target variable
    target = data['total']
    
    # Create the feature matrix
    X = encoded_features
    y = target
    
    return X, y, encoder

def train_model(X_train, y_train):
    """
    Trains a RandomForestRegressor model for score prediction.
    """
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    return model

def main():
    """
    Main function to run the model training pipeline.
    """
    # Step 1: Load and preprocess data
    data = load_data('public/data/ipl_data.csv')
    if data is None:
        return

    X, y, encoder = preprocess_data(data)
    
    # Step 2: Train-Test Split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    # Step 3: Train the model
    model = train_model(X_train, y_train)
    
    # Step 4: Evaluate the model
    y_pred = model.predict(X_test)
    mse = mean_squared_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)
    print(f"Model Mean Squared Error: {mse:.2f}")
    print(f"Model R-squared Score: {r2:.2f}")
    
    # Step 5: Export the trained model and encoders
    try:
        if not os.path.exists('model'):
            os.makedirs('model')
        
        with open('model/score_prediction_model.pkl', 'wb') as f:
            pickle.dump(model, f)
            print("Successfully exported the trained model to 'model/score_prediction_model.pkl'")
        
        with open('model/data_encoder.pkl', 'wb') as f:
            pickle.dump(encoder, f)
            print("Successfully exported the data encoder to 'model/data_encoder.pkl'")

    except Exception as e:
        print(f"An error occurred while exporting files: {e}")

if __name__ == "__main__":
    main()