import pandas as pd
df = pd.read_csv('Data/balanced_hate_dataset_18k.csv')
for label in sorted(df['label'].unique()):
    print(f"Label {label}:")
    print(df[df['label'] == label]['text'].head(3).tolist())
    print("-" * 20)
