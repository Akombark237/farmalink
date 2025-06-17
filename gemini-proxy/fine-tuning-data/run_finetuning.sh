#!/bin/bash

# Script to run the fine-tuning process

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Python 3 is required but not found. Please install Python 3."
    exit 1
fi

# Create a virtual environment
echo "Creating a virtual environment..."
python3 -m venv venv

# Activate the virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "Installing dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Run the fine-tuning script
echo "Starting fine-tuning process..."
python finetune_embeddings.py \
    --input_file medical_content.jsonl \
    --output_dir ./medical-embeddings \
    --base_model all-MiniLM-L6-v2 \
    --batch_size 16 \
    --epochs 3 \
    --learning_rate 2e-5 \
    --max_seq_length 256 \
    --hf_token ${HF_TOKEN:-""} \
    --push_to_hub \
    --model_name qala-lwazi/medical-embeddings

# Convert the model to Transformers.js format
echo "Converting model to Transformers.js format..."
python convert_to_transformers_js.py \
    --model_path ./medical-embeddings \
    --output_dir ./medical-embeddings-js \
    --hf_token ${HF_TOKEN:-""} \
    --push_to_hub \
    --model_name qala-lwazi/medical-embeddings-js

# Deactivate the virtual environment
deactivate

echo "Fine-tuning completed!"
