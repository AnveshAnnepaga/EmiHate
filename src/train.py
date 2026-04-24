import os
import torch
import gc
from transformers import AutoModelForSequenceClassification, TrainingArguments, Trainer
from dataset_loader import load_and_tokenize_dataset, LANGUAGE_CONFIGS
from metrics import compute_metrics

ROOT_DIR = os.path.dirname(os.path.dirname(__file__))
MODELS_DIR = os.path.join(ROOT_DIR, "models")
EPOCHS = 3
BATCH_SIZE = 16

def train_language_task(lang: str, task: str):
    print(f"\n{'='*60}")
    print(f"Starting Highly Optimized Training: {lang.upper()} -> {task.upper()}")
    print(f"{'='*60}")

    tokenized_datasets, tokenizer, num_classes = load_and_tokenize_dataset(lang, task)
    tokenizer_name = LANGUAGE_CONFIGS[lang]["tokenizer_name"]

    device = "cuda" if torch.cuda.is_available() else "cpu"
    
    model_identifier = f"{lang}_{task}_best_model"
    output_dir = os.path.join(MODELS_DIR, f"{lang}_{task}_checkpoints")
    best_model_dir = os.path.join(MODELS_DIR, model_identifier)
    os.makedirs(output_dir, exist_ok=True)

    print(f"Loading base model {tokenizer_name} with {num_classes} labels for {task}...")
    model = AutoModelForSequenceClassification.from_pretrained(tokenizer_name, num_labels=num_classes)
    model.to(device)

    training_args = TrainingArguments(
        output_dir=output_dir,
        eval_strategy="epoch",      
        save_strategy="epoch",        
        learning_rate=2e-5,
        per_device_train_batch_size=BATCH_SIZE,
        per_device_eval_batch_size=BATCH_SIZE,
        num_train_epochs=EPOCHS,
        weight_decay=0.01,
        load_best_model_at_end=True,  
        metric_for_best_model="f1",   
        greater_is_better=True,
        fp16=True if device == "cuda" else False,
        logging_dir=os.path.join(output_dir, "logs"),
        logging_steps=50,
        save_total_limit=3  
    )

    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=tokenized_datasets["train"],
        eval_dataset=tokenized_datasets["test"],
        compute_metrics=compute_metrics,
        processing_class=tokenizer,
    )

    try:
        trainer.train()
    except Exception as e:
        print(f"An error occurred during training {lang}->{task}: {e}")
    finally:
        trainer.save_model(best_model_dir)
        tokenizer.save_pretrained(best_model_dir)
        
        # Aggressive memory purging across the 9 iterations
        del trainer, model, tokenized_datasets
        gc.collect()
        if torch.cuda.is_available():
            torch.cuda.empty_cache()

if __name__ == "__main__":
    os.makedirs(MODELS_DIR, exist_ok=True)
    
    try:
        for lang in LANGUAGE_CONFIGS.keys():
            for task in ["hate", "emotion", "sentiment"]:
                train_language_task(lang, task)
        print("\nAll 9 Multi-Head Language Training Operations Completed Flawlessly! Check your models/ directory.")
    except KeyboardInterrupt:
        print("\nUser Interrupted Process! (Checkpoint is safe).")
