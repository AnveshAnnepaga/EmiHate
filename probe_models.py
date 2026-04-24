import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import os
import json

MODELS_DIR = "models"
device = "cuda" if torch.cuda.is_available() else "cpu"

test_sentences = {
    "hate": {
        "english": ["I hate you you terrible person!", "You are so stupid and offensive.", "The weather is nice today."],
        "hindi": ["मैं तुमसे नफरత करता हूँ!", "यह एक सामान्य दिन है।"],
        "telugu": ["నేను నిన్ను ద్వేషిస్తున్నాను!", "ఈ రోజు చాలా బాగుంది."]
    },
    "sentiment": {
        "english": ["I am so sad and depressed.", "It is okay.", "I am very happy and joyful!"],
        "hindi": ["मैं बहुत दुखी हूँ।", "ठीक है।", "मैं बहुत खुश हूँ!"],
        "telugu": ["నేను చాలా బాధగా ఉన్నాను.", "మంచిది.", "నేను చాలా సంతోషంగా ఉన్నాను!"]
    },
    "emotion": {
        "english": ["I am so angry right now!", "I am so scared and afraid.", "I hate this!", "I am neutral.", "I am feeling sad."]
    }
}

def probe():
    langs = ["english", "hindi", "telugu"]
    tasks = ["hate", "sentiment", "emotion"]
    all_results = {}
    
    for lang in langs:
        for task in tasks:
            path = os.path.join(MODELS_DIR, f"{lang}_{task}_best_model")
            if not os.path.exists(path): continue
            
            key = f"{lang}_{task}"
            all_results[key] = []
            
            tokenizer = AutoTokenizer.from_pretrained(path)
            model = AutoModelForSequenceClassification.from_pretrained(path).to(device).eval()
            
            sentences = test_sentences.get(task, {}).get(lang, ["Sample text"])
            if task == "emotion" and lang != "english":
                sentences = test_sentences["emotion"]["english"]
                
            for text in sentences:
                inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True).to(device)
                with torch.no_grad():
                    logits = model(**inputs).logits
                    probs = torch.softmax(logits, dim=-1).cpu().numpy()[0]
                
                pred_id = int(probs.argmax())
                all_results[key].append({
                    "text": text,
                    "pred_id": pred_id,
                    "probs": [float(p) for p in probs]
                })

    with open("probe_results.json", "w", encoding="utf-8") as f:
        json.dump(all_results, f, indent=2, ensure_ascii=False)

if __name__ == "__main__":
    probe()
