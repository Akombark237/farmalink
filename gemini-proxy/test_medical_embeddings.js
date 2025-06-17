// Script to test the fine-tuned medical embeddings with the Pinecone service
const fs = require('fs');
const path = require('path');
const { Pinecone } = require('@pinecone-database/pinecone');
const { pipeline } = require('@xenova/transformers');

// Pinecone configuration
const PINECONE_API_KEY = 'pcsk_7Ja3Eb_RjiusV2FSEbXVwcvQh5EcyDor8acU2tsK3CiKnBcGD9eX8H8A7RH1ar7TmnfBvr';
const PINECONE_INDEX = 'medical-handbook';

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
  // Use the path to the fine-tuned model
  const medicalModelPath = path.join(__dirname, 'fine-tuning-data', 'medical-embeddings');
  console.log(`Looking for model at: ${medicalModelPath}`);
  
  // Check if the directory exists
  if (!fs.existsSync(medicalModelPath)) {
    console.error(`Model directory not found at ${medicalModelPath}`);
    console.log('Using base model for both tests');
    return { baseModel, medicalModel: baseModel };
  }
  
  try {
    const medicalModel = await pipeline('feature-extraction', medicalModelPath);
    return { baseModel, medicalModel };
  } catch (error) {
    console.error('Error loading medical model:', error);
    console.log('Using base model for both tests');
    return { baseModel, medicalModel: baseModel };
  }
}

// Function to generate embeddings
async function generateEmbedding(model, text) {
  try {
    const result = await model(text, { pooling: 'mean', normalize: true });
    return Array.from(result.data);
  } catch (error) {
    console.error('Error generating embedding:', error);
    // Return a random embedding as fallback
    return Array(384).fill(0).map(() => Math.random() * 2 - 1);
  }
}

// Function to query Pinecone with different embeddings
async function queryPinecone(embedding, topK = 3) {
  // Initialize Pinecone client
  const pc = new Pinecone({
    apiKey: PINECONE_API_KEY,
  });
  
  // Connect to the index
  const index = pc.index(PINECONE_INDEX);
  
  // Query Pinecone with the embedding
  const queryResponse = await index.query({
    vector: embedding,
    topK: topK,
    includeMetadata: true,
  });
  
  return queryResponse.matches.map(match => ({
    id: match.id,
    score: match.score,
    text: match.metadata?.text || '',
  }));
}

// Function to compare results from both models
async function compareResults(baseModel, medicalModel, query) {
  console.log(`\nQuery: "${query}"`);
  
  // Generate embeddings with both models
  console.log('Generating base model embedding...');
  const baseEmbedding = await generateEmbedding(baseModel, query);
  
  console.log('Generating medical model embedding...');
  const medicalEmbedding = await generateEmbedding(medicalModel, query);
  
  // Query Pinecone with both embeddings
  console.log('Querying Pinecone with base model embedding...');
  const baseResults = await queryPinecone(baseEmbedding);
  
  console.log('Querying Pinecone with medical model embedding...');
  const medicalResults = await queryPinecone(medicalEmbedding);
  
  // Print results
  console.log('\nBase Model Results:');
  console.log('------------------');
  baseResults.forEach((result, i) => {
    console.log(`${i+1}. Score: ${result.score.toFixed(4)}`);
    console.log(`   ${result.text.substring(0, 150)}...`);
  });
  
  console.log('\nMedical Model Results:');
  console.log('---------------------');
  medicalResults.forEach((result, i) => {
    console.log(`${i+1}. Score: ${result.score.toFixed(4)}`);
    console.log(`   ${result.text.substring(0, 150)}...`);
  });
  
  // Calculate overlap between results
  const baseIds = new Set(baseResults.map(r => r.id));
  const medicalIds = new Set(medicalResults.map(r => r.id));
  const overlap = [...baseIds].filter(id => medicalIds.has(id)).length;
  
  console.log(`\nOverlap: ${overlap}/${Math.min(baseIds.size, medicalIds.size)} results in common`);
  
  return {
    query,
    baseResults,
    medicalResults,
    overlap
  };
}

// Main function
async function main() {
  try {
    // Load models
    const { baseModel, medicalModel } = await loadModels();
    
    // Compare results for each query
    const results = [];
    for (const query of MEDICAL_QUERIES.slice(0, 3)) { // Test first 3 queries
      const result = await compareResults(baseModel, medicalModel, query);
      results.push(result);
    }
    
    // Calculate average overlap
    const avgOverlap = results.reduce((sum, r) => sum + r.overlap, 0) / results.length;
    
    console.log('\nSummary:');
    console.log('--------');
    console.log(`Average overlap: ${avgOverlap.toFixed(2)} results in common`);
    console.log(`Lower overlap indicates more specialization for medical domain.`);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the main function
main();
