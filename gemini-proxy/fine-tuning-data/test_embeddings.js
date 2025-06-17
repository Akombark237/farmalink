// Script to test the fine-tuned medical embeddings
const { pipeline } = require('@xenova/transformers');
const fs = require('fs');
const path = require('path');

// Test queries
const MEDICAL_QUERIES = [
  "What are the symptoms of diabetes?",
  "How is hypertension diagnosed?",
  "What treatments are available for asthma?",
  "What are the risk factors for heart disease?",
  "How does chemotherapy work for cancer treatment?",
  "What are the side effects of antibiotics?",
  "How is pneumonia treated in elderly patients?",
  "What are the early signs of Alzheimer's disease?",
  "How is rheumatoid arthritis different from osteoarthritis?",
  "What are the complications of untreated hypothyroidism?"
];

// Function to load the embedding models
async function loadModels() {
  console.log('Loading the base model (all-MiniLM-L6-v2)...');
  const baseModel = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');

  console.log('Loading the fine-tuned medical model...');
  // Use the local path to the model
  const medicalModelPath = path.join(__dirname, 'medical-embeddings', 'transformers_js');
  console.log(`Looking for model at: ${medicalModelPath}`);

  // Check if the directory exists
  if (!fs.existsSync(medicalModelPath)) {
    console.log('Model directory not found. Checking parent directory...');
    // Try the parent directory
    const altPath = path.join(__dirname, 'medical-embeddings');
    if (fs.existsSync(altPath)) {
      console.log(`Found model at: ${altPath}`);
      const medicalModel = await pipeline('feature-extraction', altPath);
      return { baseModel, medicalModel };
    } else {
      throw new Error(`Model directory not found at ${medicalModelPath} or ${altPath}`);
    }
  }

  const medicalModel = await pipeline('feature-extraction', medicalModelPath);

  return { baseModel, medicalModel };
}

// Function to generate embeddings
async function generateEmbeddings(model, text) {
  const result = await model(text, { pooling: 'mean', normalize: true });
  return Array.from(result.data);
}

// Function to calculate cosine similarity between two vectors
function cosineSimilarity(vecA, vecB) {
  if (vecA.length !== vecB.length) {
    throw new Error('Vectors must have the same length');
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Function to compare embeddings from both models
async function compareEmbeddings(baseModel, medicalModel, queries) {
  console.log('\nComparing embeddings for medical queries:');
  console.log('----------------------------------------');

  const results = [];

  for (const query of queries) {
    console.log(`\nQuery: "${query}"`);

    // Generate embeddings with both models
    const baseEmbedding = await generateEmbeddings(baseModel, query);
    const medicalEmbedding = await generateEmbeddings(medicalModel, query);

    // Calculate similarity between the two embeddings
    const similarity = cosineSimilarity(baseEmbedding, medicalEmbedding);

    console.log(`Similarity between base and medical embeddings: ${similarity.toFixed(4)}`);

    // Store results
    results.push({
      query,
      similarity,
      baseEmbedding: baseEmbedding.slice(0, 5), // Just store first 5 dimensions for display
      medicalEmbedding: medicalEmbedding.slice(0, 5)
    });
  }

  return results;
}

// Main function
async function main() {
  try {
    // Load models
    const { baseModel, medicalModel } = await loadModels();

    // Compare embeddings
    const results = await compareEmbeddings(baseModel, medicalModel, MEDICAL_QUERIES);

    // Calculate average similarity
    const avgSimilarity = results.reduce((sum, r) => sum + r.similarity, 0) / results.length;

    console.log('\nSummary:');
    console.log('--------');
    console.log(`Average similarity between base and medical embeddings: ${avgSimilarity.toFixed(4)}`);
    console.log(`Lower similarity indicates more specialization for medical domain.`);

    // Save results to file
    const outputPath = path.join(__dirname, 'embedding_comparison.json');
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
    console.log(`\nDetailed results saved to ${outputPath}`);

  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the main function
main();
