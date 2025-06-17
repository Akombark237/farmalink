# Medical Embeddings Fine-tuning

This directory contains scripts and data for fine-tuning an embedding model on medical text to improve the performance of the Qala-Lwazi medical chatbot.

## Overview

The fine-tuning process involves:

1. Extracting medical content from the Pinecone index
2. Fine-tuning the all-MiniLM-L6-v2 model on this medical content
3. Converting the fine-tuned model to a format compatible with Transformers.js
4. Updating the backend to use the fine-tuned model

## Prerequisites

- Python 3.8 or higher
- Node.js 14 or higher
- A Hugging Face account and API token
- Sufficient disk space (at least 2GB)
- GPU recommended for faster training (but CPU is also supported)

## Files

- `medical_content.jsonl`: Medical text extracted from Pinecone
- `extract_medical_content.js`: Script to extract medical content from Pinecone
- `extract_medical_content_v2.js`: Improved version of the extraction script
- `finetune_embeddings.py`: Script to fine-tune the embedding model
- `simple_finetune.py`: Simplified version of the fine-tuning script
- `convert_to_transformers_js.py`: Script to convert the model to Transformers.js format
- `run_finetuning.sh`: Shell script to run the entire fine-tuning process
- `test_embeddings.js`: Script to test the fine-tuned model
- `requirements.txt`: Python dependencies for fine-tuning
- `README.md`: This file

## Running the Fine-tuning Process

1. Make sure you have Python 3.8+ installed
2. Run the fine-tuning script:

```bash
./run_finetuning.sh
```

This will:
- Create a virtual environment
- Install the required dependencies
- Fine-tune the model on the medical content
- Convert the model to Transformers.js format
- Push the model to the Hugging Face Hub

## Updating the Backend

After fine-tuning, update the backend to use the fine-tuned model:

```bash
cd ..
node update_backend.js
```

Then restart the backend server:

```bash
node server.js
```

## Fine-tuning Parameters

You can adjust the fine-tuning parameters in `run_finetuning.sh`:

- `--batch_size`: Training batch size (default: 16)
- `--epochs`: Number of training epochs (default: 3)
- `--learning_rate`: Learning rate (default: 2e-5)
- `--max_seq_length`: Maximum sequence length (default: 256)

## Model Details

The fine-tuned model:
- Is based on all-MiniLM-L6-v2
- Has 384 dimensions
- Is optimized for medical text
- Is compatible with Transformers.js
- Is pushed to the Hugging Face Hub as `qala-lwazi/medical-embeddings-js`

## Troubleshooting

If you encounter any issues:

1. Check that you have sufficient disk space
2. Ensure your Hugging Face token is valid
3. Try running with fewer epochs or a smaller batch size if you run out of memory
4. Check the Python and Node.js versions

## References

- [Sentence Transformers Documentation](https://www.sbert.net/)
- [Hugging Face Transformers](https://huggingface.co/docs/transformers/index)
- [Transformers.js](https://huggingface.co/docs/transformers.js/index)
