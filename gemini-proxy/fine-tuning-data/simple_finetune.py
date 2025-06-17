#!/usr/bin/env python3
"""
Simple fine-tuning script for medical embeddings using sentence-transformers.
This script uses a simpler approach without requiring the datasets library.
"""

import os
import json
import random
import torch
from sentence_transformers import SentenceTransformer, InputExample, losses
from torch.utils.data import DataLoader

# Configuration
INPUT_FILE = 'medical_content.jsonl'
OUTPUT_DIR = './medical-embeddings'
BASE_MODEL = 'all-MiniLM-L6-v2'
BATCH_SIZE = 16
EPOCHS = 3
LEARNING_RATE = 2e-5
MAX_SEQ_LENGTH = 256

# Create output directory if it doesn't exist
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Load medical content from JSONL file
print(f"Loading medical content from {INPUT_FILE}...")
texts = []
with open(INPUT_FILE, 'r', encoding='utf-8') as f:
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
print(f"Loading base model: {BASE_MODEL}...")
model = SentenceTransformer(BASE_MODEL)
model.max_seq_length = MAX_SEQ_LENGTH

# Create a custom collate function for InputExample
def collate_input_examples(batch):
    texts1 = [example.texts[0] for example in batch]
    texts2 = [example.texts[1] for example in batch]
    labels = torch.tensor([example.label for example in batch])
    return texts1, texts2, labels

# Create data loaders with custom collate function
train_dataloader = DataLoader(
    train_examples,
    shuffle=True,
    batch_size=BATCH_SIZE,
    collate_fn=collate_input_examples
)

# Define the optimizer
optimizer = torch.optim.AdamW(model.parameters(), lr=LEARNING_RATE)
model.optimizer = optimizer

# Define the loss function
train_loss = losses.ContrastiveLoss(model)

# Train the model
print("Starting training...")
warmup_steps = int(len(train_dataloader) * EPOCHS * 0.1)

# Simple training loop
for epoch in range(EPOCHS):
    model.train()
    total_loss = 0

    for batch in train_dataloader:
        texts1, texts2, labels = batch

        # Process text through the model manually to maintain gradients
        features1 = model.tokenize(texts1)
        features2 = model.tokenize(texts2)

        # Convert to proper device
        for key in features1:
            if isinstance(features1[key], torch.Tensor):
                features1[key] = features1[key].to(model.device)

        for key in features2:
            if isinstance(features2[key], torch.Tensor):
                features2[key] = features2[key].to(model.device)

        # Get embeddings with gradients
        embeddings1 = model(features1)['sentence_embedding']
        embeddings2 = model(features2)['sentence_embedding']

        # Normalize embeddings
        embeddings1 = torch.nn.functional.normalize(embeddings1, p=2, dim=1)
        embeddings2 = torch.nn.functional.normalize(embeddings2, p=2, dim=1)

        # Calculate dot product (cosine similarity for normalized vectors)
        cos_sim = torch.sum(embeddings1 * embeddings2, dim=1)

        # Convert labels to float tensor
        labels = labels.float().to(model.device)

        # Calculate loss (contrastive loss)
        # For positive pairs (label=1), we want cosine similarity to be 1
        # For negative pairs (label=0), we want cosine similarity to be -1
        pos_loss = labels * torch.square(1 - cos_sim)
        neg_loss = (1 - labels) * torch.square(torch.clamp(cos_sim - 0, min=0))
        loss = torch.mean(pos_loss + neg_loss)

        # Backpropagation
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()

        total_loss += loss.item()

    avg_loss = total_loss / len(train_dataloader)
    print(f"Epoch {epoch+1}/{EPOCHS}: Average loss = {avg_loss:.4f}")

    # Save checkpoint after each epoch
    model.save(os.path.join(OUTPUT_DIR, f"checkpoint-epoch-{epoch+1}"))

# Save the final model
model.save(OUTPUT_DIR)
print(f"Model saved to {OUTPUT_DIR}")

# Export the model for use with Transformers.js
print("Exporting model for Transformers.js...")
model.save_pretrained(os.path.join(OUTPUT_DIR, "transformers_js"))

print("Fine-tuning completed successfully!")
