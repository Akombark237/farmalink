#!/usr/bin/env python3
"""
Convert a fine-tuned Sentence Transformers model to a format compatible with Transformers.js.
This script takes a fine-tuned model and prepares it for use with Transformers.js in the Node.js backend.
"""

import os
import argparse
import shutil
import json
from sentence_transformers import SentenceTransformer
from huggingface_hub import login, HfApi

# Parse command line arguments
parser = argparse.ArgumentParser(description='Convert a fine-tuned model to Transformers.js format')
parser.add_argument('--model_path', type=str, default='./medical-embeddings', help='Path to the fine-tuned model')
parser.add_argument('--output_dir', type=str, default='./medical-embeddings-js', help='Output directory for the converted model')
parser.add_argument('--hf_token', type=str, default='', help='Hugging Face token for uploading the model')
parser.add_argument('--push_to_hub', action='store_true', help='Push the model to Hugging Face Hub')
parser.add_argument('--model_name', type=str, default='medical-embeddings-js', help='Model name for Hugging Face Hub')
args = parser.parse_args()

# Login to Hugging Face Hub if token is provided
if args.hf_token:
    login(token=args.hf_token)

# Create output directory if it doesn't exist
os.makedirs(args.output_dir, exist_ok=True)

# Load the fine-tuned model
print(f"Loading fine-tuned model from {args.model_path}...")
model = SentenceTransformer(args.model_path)

# Save the model in Hugging Face Transformers format
print(f"Converting model to Transformers format...")
model.save_pretrained(args.output_dir)

# Create a config.json file compatible with Transformers.js
config = {
    "architectures": ["BertModel"],
    "model_type": "bert",
    "hidden_size": 384,
    "num_attention_heads": 12,
    "num_hidden_layers": 6,
    "vocab_size": model.tokenizer.vocab_size,
    "max_position_embeddings": 512,
    "hidden_act": "gelu",
    "transformers_js": {
        "pooling": "mean",
        "normalize": True
    }
}

# Save the config.json file
with open(os.path.join(args.output_dir, 'config.json'), 'w') as f:
    json.dump(config, f, indent=2)

# Create a README.md file
readme_content = f"""# Medical Embeddings for Transformers.js

This model is a fine-tuned version of `all-MiniLM-L6-v2` optimized for medical text.

## Model Details

- **Base Model**: all-MiniLM-L6-v2
- **Dimensions**: 384
- **Fine-tuned on**: Medical handbook content
- **Use Case**: Generating embeddings for medical text retrieval

## Usage with Transformers.js

```javascript
const { pipeline } = require('@xenova/transformers');

// Load the model
const model = await pipeline('feature-extraction', '{args.model_name}');

// Generate embeddings
const text = "What are the symptoms of diabetes?";
const result = await model(text, {{ pooling: 'mean', normalize: true }});
const embedding = Array.from(result.data);
```
"""

# Save the README.md file
with open(os.path.join(args.output_dir, 'README.md'), 'w') as f:
    f.write(readme_content)

print(f"Model converted and saved to {args.output_dir}")

# Push to Hugging Face Hub if requested
if args.push_to_hub and args.hf_token:
    print(f"Pushing model to Hugging Face Hub as {args.model_name}...")
    api = HfApi()
    api.create_repo(args.model_name, exist_ok=True)
    api.upload_folder(
        folder_path=args.output_dir,
        repo_id=args.model_name,
        commit_message="Upload model compatible with Transformers.js"
    )
    print(f"Model pushed to Hugging Face Hub: {args.model_name}")

print("Conversion completed successfully!")
