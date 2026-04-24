import numpy as np
import evaluate

# Load metrics once
accuracy_metric = evaluate.load("accuracy")
f1_metric = evaluate.load("f1")
precision_metric = evaluate.load("precision")
recall_metric = evaluate.load("recall")

def compute_metrics(eval_pred):
    """
    Computes Precision, Recall, Accuracy, and F1-Score at the end of each epoch.
    """
    logits, labels = eval_pred
    # Determine predictions from logits
    predictions = np.argmax(logits, axis=-1)
    
    # Calculate each metric
    # Use average='weighted' to handle multi-class robustly (applicable to 'class' ranging 0-2)
    acc = accuracy_metric.compute(predictions=predictions, references=labels)
    # Handle multi-class F1, Precision, and Recall using weighted average
    f1 = f1_metric.compute(predictions=predictions, references=labels, average="weighted")
    precision = precision_metric.compute(predictions=predictions, references=labels, average="weighted")
    recall = recall_metric.compute(predictions=predictions, references=labels, average="weighted")
    
    return {
        "accuracy": acc["accuracy"],
        "f1": f1["f1"],
        "precision": precision["precision"],
        "recall": recall["recall"],
    }
