import joblib
import pandas as pd
import numpy as np
from django.conf import settings
import os

class FlightPredictor:
    def __init__(self):
        # Define file paths
        base_dir = settings.BASE_DIR
        model_path = os.path.join(base_dir, 'ml_model', 'model.pkl')
        columns_path = os.path.join(base_dir, 'ml_model', 'model_columns.pkl')
        if not os.path.exists(model_path):
            model_path = os.path.join(base_dir, 'model.pkl')
        if not os.path.exists(columns_path):
            columns_path = os.path.join(base_dir, 'model_columns.pkl')

        self.model_path = model_path
        self.columns_path = columns_path

        self.model = None
        self.model_columns = None
        if not os.path.exists(model_path) or not os.path.exists(columns_path):
            print("Error: Model or columns file not found.")

    def _load_model_if_needed(self):
        if self.model is None:
            print("--- Loading model into memory... ---")
            self.model = joblib.load(self.model_path)
            self.model_columns = joblib.load(self.columns_path)
            print("--- Model loaded successfully. ---")

    def preprocess(self, input_data):
        # Create a DataFrame from the input data (dict)
        df = pd.DataFrame(input_data, index=[0])

        # --- NEW STEP: Generate Cyclical Features First ---
        # 1. Handle 'Time' (cyclical features) before one-hot encoding
        minutes_in_day = 24 * 60
        df['Time_sin'] = np.sin(2 * np.pi * df['Time'] / minutes_in_day)
        df['Time_cos'] = np.cos(2 * np.pi * df['Time'] / minutes_in_day)

        # 2. Drop the original 'Time' column now that we have sin/cos
        df = df.drop('Time', axis=1)

        # --- Categorical Encoding (get_dummies) ---
        # 3. Apply the encoding to the *new* DataFrame
        df_processed = pd.get_dummies(df, columns=['Airline', 'AirportFrom', 'AirportTo'])

        # --- Reindex (Critical Step) ---
        # 4. Reindex with the model's columns list
        df_processed = df_processed.reindex(columns=self.model_columns, fill_value=0)

        # We must NOT run the cyclical feature creation steps here,
        # as the columns already exist.

        return df_processed
    
    
    def predict(self, input_data):
        """
        Makes a delay prediction from raw input data.
        """
        if not os.path.exists(self.model_path) or not os.path.exists(self.columns_path):
            return {"error": "Model not loaded."}
        try:
            self._load_model_if_needed()
        except Exception as exc:
            return {"error": f"Model not loaded: {exc}"}

        # Preprocess the raw data
        processed_data = self.preprocess(input_data)

        # Make prediction
        # model.predict() returns [0] or [1]
        # model.predict_proba() returns [[prob_0, prob_1]]
        prediction_proba = self.model.predict_proba(processed_data)

        # Get the probability of a delay (class 1)
        delay_probability = prediction_proba[0][1]

        return delay_probability