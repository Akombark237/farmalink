#!/usr/bin/env python3
"""
Fine-tune a sentence transformer model on medical data for improved embeddings.
This script uses the medical content extracted from Pinecone to fine-tune
the all-MiniLM-L6-v2 model for better performance on medical text.
"""

import os
import json
import random
import argparse
import torch
from torch.utils.data import DataLoader
from sentence_transformers import SentenceTransformer, InputExample, losses
from sentence_transformers.evaluation import EmbeddingSimilarityEvaluator
from huggingface_hub import login

# Parse command line arguments
parser = argparse.ArgumentParser(description='Fine-tune a sentence transformer model on medical data')
parser.add_argument('--input_file', type=str, default='medical_content.jsonl', help='Input JSONL file with medical text')
parser.add_argument('--output_dir', type=str, default='./medical-embeddings', help='Output directory for the fine-tuned model')
parser.add_argument('--base_model', type=str, default='all-MiniLM-L6-v2', help='Base model to fine-tune')
parser.add_argument('--batch_size', type=int, default=16, help='Training batch size')
parser.add_argument('--epochs', type=int, default=3, help='Number of training epochs')
parser.add_argument('--learning_rate', type=float, default=2e-5, help='Learning rate')
parser.add_argument('--max_seq_length', type=int, default=256, help='Maximum sequence length')
parser.add_argument('--hf_token', type=str, default='', help='Hugging Face token for uploading the model')
parser.add_argument('--push_to_hub', action='store_true', help='Push the model to Hugging Face Hub')
parser.add_argument('--model_name', type=str, default='medical-embeddings', help='Model name for Hugging Face Hub')
args = parser.parse_args()

# Login to Hugging Face Hub if token is provided
if args.hf_token:
    login(token=args.hf_token)

# Create output directory if it doesn't exist
os.makedirs(args.output_dir, exist_ok=True)

# Load medical content from JSONL file
print(f"Loading medical content from {args.input_file}...")
texts = []
with open(args.input_file, 'r', encoding='utf-8') as f:
    for line in f:
        try:
            item = json.loads(line.strip())
            if 'text' in item and item['text'].strip():
                texts.append(item['text'].strip())
        except json.JSONDecodeError:
            continue

print(f"Loaded {len(texts)} medical text entries")

# Function to create training examples
def create_training_examples(texts, chunk_size=128, overlap=64):
    """
    Create training examples from texts using a sliding window approach.
    For each text, create chunks with overlap and use adjacent chunks as positive pairs.
    """
    examples = []
    
    for text in texts:
        # Skip very short texts
        if len(text) < chunk_size * 1.5:
            continue
            
        # Create chunks with overlap
        chunks = []
        for i in range(0, len(text) - chunk_size + 1, chunk_size - overlap):
            chunk = text[i:i + chunk_size]
            chunks.append(chunk)
            
        # Create positive pairs from adjacent chunks
        if len(chunks) >= 2:
            for i in range(len(chunks) - 1):
                examples.append(InputExample(texts=[chunks[i], chunks[i+1]], label=1.0))
                
    return examples

# Create training examples
print("Creating training examples...")
train_examples = create_training_examples(texts)
print(f"Created {len(train_examples)} training examples")

# Split into train and validation sets
random.shuffle(train_examples)
val_examples = train_examples[:int(len(train_examples) * 0.1)]
train_examples = train_examples[int(len(train_examples) * 0.1):]
print(f"Training set: {len(train_examples)} examples")
print(f"Validation set: {len(val_examples)} examples")

# Load the base model
print(f"Loading base model: {args.base_model}...")
model = SentenceTransformer(args.base_model)
model.max_seq_length = args.max_seq_length

# Create data loaders
train_dataloader = DataLoader(train_examples, shuffle=True, batch_size=args.batch_size)
val_dataloader = DataLoader(val_examples, shuffle=False, batch_size=args.batch_size)

# Define the loss function
train_loss = losses.ContrastiveLoss(model)

# Create evaluator
evaluator = EmbeddingSimilarityEvaluator.from_input_examples(val_examples, name='medical-eval')

# Train the model
print("Starting training...")
warmup_steps = int(len(train_dataloader) * args.epochs * 0.1)
model.fit(
    train_objectives=[(train_dataloader, train_loss)],
    evaluator=evaluator,
    epochs=args.epochs,
    warmup_steps=warmup_steps,
    evaluation_steps=int(len(train_dataloader) * 0.5),
    output_path=args.output_dir,
    save_best_model=True,
    optimizer_params={'lr': args.learning_rate}
)

print(f"Model saved to {args.output_dir}")

# Push to Hugging Face Hub if requested
if args.push_to_hub and args.hf_token:
    print(f"Pushing model to Hugging Face Hub as {args.model_name}...")
    model.save_to_hub(args.model_name)
    print(f"Model pushed to Hugging Face Hub: {args.model_name}")

print("Fine-tuning completed successfully!")
