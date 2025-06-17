// Script to extract medical content from Pinecone using our existing query functionality
const fs = require('fs');
const path = require('path');
const pineconeService = require('./pineconeService');

// Output file path
const OUTPUT_DIR = path.join(__dirname, 'fine-tuning-data');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'medical_content.jsonl');

// Create output directory if it doesn't exist
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Common medical terms to use as queries to retrieve diverse content
const MEDICAL_QUERIES = [
  "heart disease", "diabetes", "cancer", "hypertension", "stroke",
  "asthma", "arthritis", "alzheimer", "parkinson", "epilepsy",
  "pneumonia", "influenza", "tuberculosis", "malaria", "hiv",
  "depression", "anxiety", "schizophrenia", "bipolar", "adhd",
  "pregnancy", "childbirth", "pediatrics", "geriatrics", "surgery",
  "anesthesia", "radiology", "pathology", "oncology", "cardiology",
  "neurology", "gastroenterology", "nephrology", "urology", "dermatology",
  "orthopedics", "ophthalmology", "otolaryngology", "gynecology", "obstetrics",
  "antibiotics", "vaccines", "analgesics", "antivirals", "antifungals",
  "diagnosis", "prognosis", "treatment", "prevention", "rehabilitation"
];

// Function to extract medical content using our existing query functionality
async function extractMedicalContent() {
  console.log('Initializing Pinecone service...');
  await pineconeService.initialize();
  console.log('Pinecone service initialized');
  
  const allContent = new Map(); // Use Map to avoid duplicates
  
  // Query each medical term and collect results
  for (let i = 0; i < MEDICAL_QUERIES.length; i++) {
    const query = MEDICAL_QUERIES[i];
    console.log(`Querying term ${i+1}/${MEDICAL_QUERIES.length}: "${query}"`);
    
    try {
      // Use a large topK to get more content
      const results = await pineconeService.queryMedicalHandbook(query, 50);
      
      console.log(`Retrieved ${results.length} results for "${query}"`);
      
      // Add results to our collection
      results.forEach(result => {
        if (result.text && result.text.trim().length > 0) {
          allContent.set(result.id, {
            id: result.id,
            text: result.text.trim()
          });
        }
      });
      
      console.log(`Total unique entries so far: ${allContent.size}`);
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      console.error(`Error querying "${query}":`, error);
    }
  }
  
  // Convert Map to Array
  const contentArray = Array.from(allContent.values());
  console.log(`Extracted ${contentArray.length} unique text entries from Pinecone`);
  
  // Write to JSONL file
  const writeStream = fs.createWriteStream(OUTPUT_FILE);
  
  for (const item of contentArray) {
    writeStream.write(JSON.stringify(item) + '\n');
  }
  
  writeStream.end();
  console.log(`Saved medical content to ${OUTPUT_FILE}`);
  
  return contentArray;
}

// Run the extraction
extractMedicalContent()
  .then(() => {
    console.log('Extraction completed successfully');
  })
  .catch(error => {
    console.error('Error during extraction:', error);
  });
