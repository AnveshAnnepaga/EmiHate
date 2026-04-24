import pandas as pd
import os

DATA_DIR = "Data"
configs = {
    "english_hate": "balanced_hate_dataset_18k.csv",
    "english_emotion": "english_emotion_40k.csv",
    "english_sentiment": "balanced_sentiment_dataset.csv",
    "hindi_hate": "hindi_hate_dataset_20k.csv",
    "hindi_emotion": "hindi_emotion_40k.csv",
    "hindi_sentiment": "hindi_sentiment_dataset_20k.csv",
    "telugu_hate": "telugu_hate_dataset_20k.csv",
    "telugu_emotion": "telugu_emotion_40k.csv",
    "telugu_sentiment": "telugu_sentiment_dataset_20k.csv"
}

def get_mapping(file_path):
    df = pd.read_csv(file_path)
    # Check common label column names
    col = None
    for c in ['label', 'sentiment', 'class', 'sentiment_label']:
        if c in df.columns:
            col = c
            break
    if not col:
        col = df.columns[-1]
    
    unique_vals = df[col].dropna().unique()
    if pd.api.types.is_numeric_dtype(unique_vals):
        return sorted(unique_vals.tolist())
    else:
        # pd.Categorical codes are alphabetical for strings
        return sorted(unique_vals.tolist())

for key, file in configs.items():
    path = os.path.join(DATA_DIR, file)
    if os.path.exists(path):
        mapping = get_mapping(path)
        print(f"{key}: {mapping}")
    else:
        print(f"{key}: File Missing")
