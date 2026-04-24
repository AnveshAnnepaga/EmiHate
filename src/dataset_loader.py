import os
import pandas as pd
from datasets import Dataset
from transformers import AutoTokenizer

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "Data")

LANGUAGE_CONFIGS = {
    "english": {
        "tokenizer_name": "roberta-base", # Member 1 Focus
        "tasks": {
            "hate": {"file": "balanced_hate_dataset_18k.csv", "text_col": "tweet", "label_col": "class"},
            "emotion": {"file": "english_emotion_40k.csv", "text_col": "text", "label_col": "label"},
            "sentiment": {"file": "balanced_sentiment_dataset.csv", "text_col": "text", "label_col": "sentiment"} 
        }
    },
    "hindi": {
        "tokenizer_name": "ai4bharat/indic-bert", # Member 3 Focus
        "tasks": {
            "hate": {"file": "hindi_hate_dataset_20k.csv", "text_col": "text", "label_col": "label"},
            "emotion": {"file": "hindi_emotion_40k.csv", "text_col": "text", "label_col": "label"},
            "sentiment": {"file": "hindi_sentiment_dataset_20k.csv", "text_col": "text", "label_col": "label"},
        }
    },
    "telugu": {
        "tokenizer_name": "ai4bharat/indic-bert", # Member 2 Focus
        "tasks": {
            "hate": {"file": "telugu_hate_dataset_20k.csv", "text_col": "text", "label_col": "label"},
            "emotion": {"file": "telugu_emotion_40k.csv", "text_col": "text", "label_col": "label"},
            "sentiment": {"file": "telugu_sentiment_dataset_20k.csv", "text_col": "text", "label_col": "label"},
        }
    }
}

def load_and_tokenize_dataset(lang: str, task: str):
    """
    Loads raw CSVs for the specific language + task combination (Hate, Emotion, Sentiment).
    """
    if lang not in LANGUAGE_CONFIGS:
        raise ValueError(f"Language {lang} is not supported.")
    
    config = LANGUAGE_CONFIGS[lang]["tasks"].get(task)
    if not config:
        raise ValueError(f"Task {task} not configured for {lang}.")
        
    file_path = os.path.join(DATA_DIR, config["file"])
    
    print(f"Loading '{lang}' -> '{task}' data from {file_path}")
    df = pd.read_csv(file_path)
    
    # Safe robust renames mapping anything to standard text/label matrices
    if config["text_col"] in df.columns and config["label_col"] in df.columns:
        df = df.rename(columns={config["text_col"]: "text", config["label_col"]: "label"})
    else:
        # Fallback if standard was used natively
        pass
    
    # Drop NAs
    df = df.dropna(subset=["text", "label"])
    df["text"] = df["text"].astype(str)
    
    if df["label"].dtype == 'O' or df["label"].dtype.name == 'string':
        df["label"] = pd.Categorical(df["label"]).codes
        
    df["label"] = df["label"].astype(int)
    
    num_classes = df["label"].nunique()
    hf_dataset = Dataset.from_pandas(df[["text", "label"]])
    
    dataset_split = hf_dataset.train_test_split(test_size=0.2, seed=42)
    
    tokenizer_name = LANGUAGE_CONFIGS[lang]["tokenizer_name"]
    print(f"Loading tokenizer: {tokenizer_name}")
    tokenizer = AutoTokenizer.from_pretrained(tokenizer_name)
    
    def tokenize_function(examples):
        return tokenizer(examples['text'], padding="max_length", truncation=True, max_length=128)

    print(f"Tokenizing '{lang}' '{task}' dataset...")
    tokenized_datasets = dataset_split.map(tokenize_function, batched=True)
    
    return tokenized_datasets, tokenizer, num_classes
