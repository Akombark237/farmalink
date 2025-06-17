// Script to update the backend to use the fine-tuned medical embeddings model
const fs = require('fs');
const path = require('path');

// Path to the pineconeService.js file
const PINECONE_SERVICE_PATH = path.join(__dirname, 'pineconeService.js');

// Read the current pineconeService.js file
console.log(`Reading ${PINECONE_SERVICE_PATH}...`);
const content = fs.readFileSync(PINECONE_SERVICE_PATH, 'utf8');

// Update the embedding model path to use the fine-tuned model
console.log('Updating embedding model path to use fine-tuned medical embeddings...');
const updatedContent = content.replace(
  "embeddingModel = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');",
  "embeddingModel = await pipeline('feature-extraction', 'qala-lwazi/medical-embeddings-js');"
);

// Create a backup of the original file
const backupPath = `${PINECONE_SERVICE_PATH}.bak`;
console.log(`Creating backup at ${backupPath}...`);
fs.writeFileSync(backupPath, content);

// Write the updated content
console.log(`Writing updated content to ${PINECONE_SERVICE_PATH}...`);
fs.writeFileSync(PINECONE_SERVICE_PATH, updatedContent);

// Add a note about the fine-tuned model
const noteContent = `
/*
 * This service now uses a fine-tuned embedding model optimized for medical text.
 * Model: qala-lwazi/medical-embeddings-js
 *
 * The model was fine-tuned on medical handbook content from the Pinecone index
 * to improve the quality of retrieval for medical queries.
 *
 * For more information, see the fine-tuning-data directory.
 */
`;

// Add the note at the top of the file
const contentWithNote = noteContent + updatedContent;
fs.writeFileSync(PINECONE_SERVICE_PATH, contentWithNote);

console.log('Backend updated successfully!');
console.log('');
console.log('=== NEXT STEPS ===');
console.log('1. Restart the backend server to apply the changes:');
console.log('   node server.js');
console.log('');
console.log('2. Test the fine-tuned model with medical queries:');
console.log('   - Open http://localhost:3000/chatbot');
console.log('   - Enable "Use medical handbook knowledge base" in preferences');
console.log('   - Ask medical questions to see improved retrieval quality');
console.log('');
console.log('3. Monitor the console logs to see how the fine-tuned model performs');
console.log('===================');
