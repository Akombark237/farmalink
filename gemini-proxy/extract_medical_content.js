// Script to extract medical content from Pinecone for fine-tuning embeddings
const fs = require('fs');
const path = require('path');
const { Pinecone } = require('@pinecone-database/pinecone');

// Pinecone configuration
const PINECONE_API_KEY = 'pcsk_7Ja3Eb_RjiusV2FSEbXVwcvQh5EcyDor8acU2tsK3CiKnBcGD9eX8H8A7RH1ar7TmnfBvr';
const PINECONE_INDEX = 'medical-handbook';

// Output file path
const OUTPUT_DIR = path.join(__dirname, 'fine-tuning-data');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'medical_content.jsonl');

// Create output directory if it doesn't exist
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Function to extract medical content from Pinecone
async function extractMedicalContent() {
  console.log('Connecting to Pinecone...');
  
  // Initialize Pinecone client
  const pc = new Pinecone({
    apiKey: PINECONE_API_KEY,
  });
  
  // Connect to the index
  const index = pc.index(PINECONE_INDEX);
  
  console.log(`Connected to Pinecone index: ${PINECONE_INDEX}`);
  
  // Get index stats
  const stats = await index.describeIndexStats();
  console.log(`Total vectors: ${stats.totalRecordCount}`);
  
  // Extract content using vector IDs
  const allContent = [];
  const batchSize = 100;
  let processedCount = 0;
  
  // We'll use a simple approach to get all IDs by querying with random vectors
  // and collecting unique IDs
  const uniqueIds = new Set();
  const dimension = stats.dimension;
  
  console.log('Collecting vector IDs...');
  
  // Make multiple queries with random vectors to collect IDs
  for (let i = 0; i < 10; i++) {
    const randomVector = Array(dimension).fill(0).map(() => Math.random() * 2 - 1);
    
    const queryResponse = await index.query({
      vector: randomVector,
      topK: batchSize,
      includeMetadata: false,
    });
    
    queryResponse.matches.forEach(match => {
      uniqueIds.add(match.id);
    });
    
    console.log(`Collected ${uniqueIds.size} unique IDs so far...`);
  }
  
  const allIds = Array.from(uniqueIds);
  console.log(`Total unique IDs collected: ${allIds.length}`);
  
  // Fetch vectors in batches
  for (let i = 0; i < allIds.length; i += batchSize) {
    const batchIds = allIds.slice(i, i + batchSize);
    
    console.log(`Fetching batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(allIds.length/batchSize)}...`);
    
    const response = await index.fetch({
      ids: batchIds,
      includeMetadata: true,
    });
    
    // Extract text from metadata
    Object.values(response.records).forEach(record => {
      if (record.metadata && record.metadata.text) {
        allContent.push({
          id: record.id,
          text: record.metadata.text.trim()
        });
      }
    });
    
    processedCount += batchIds.length;
    console.log(`Processed ${processedCount}/${allIds.length} vectors`);
  }
  
  console.log(`Extracted ${allContent.length} text entries from Pinecone`);
  
  // Write to JSONL file
  const writeStream = fs.createWriteStream(OUTPUT_FILE);
  
  for (const item of allContent) {
    writeStream.write(JSON.stringify(item) + '\n');
  }
  
  writeStream.end();
  console.log(`Saved medical content to ${OUTPUT_FILE}`);
  
  return allContent;
}

// Run the extraction
extractMedicalContent()
  .then(() => {
    console.log('Extraction completed successfully');
  })
  .catch(error => {
    console.error('Error during extraction:', error);
  });
