// Script to explore Pinecone index and understand its structure
const { Pinecone } = require('@pinecone-database/pinecone');

// Pinecone configuration
const apiKey = 'pcsk_7Ja3Eb_RjiusV2FSEbXVwcvQh5EcyDor8acU2tsK3CiKnBcGD9eX8H8A7RH1ar7TmnfBvr';
const host = 'https://medical-handbook-1ni237d.svc.aped-4627-b74a.pinecone.io';

async function explorePinecone() {
  try {
    // Initialize Pinecone client
    const pc = new Pinecone({
      apiKey: apiKey,
    });

    console.log('Connected to Pinecone successfully');

    // List all indexes to find the index name
    const indexesResponse = await pc.listIndexes();
    console.log('Available indexes:', indexesResponse);

    // Extract the indexes array
    const indexes = indexesResponse.indexes || [];

    // If we found indexes, explore the first one (or the medical one if identifiable)
    if (indexes.length > 0) {
      // Try to find a medical-related index, otherwise use the first one
      const medicalIndexNames = indexes.filter(index =>
        index.name.toLowerCase().includes('medical') ||
        index.name.toLowerCase().includes('med') ||
        index.name.toLowerCase().includes('health') ||
        index.name.toLowerCase().includes('handbook')
      );

      const indexName = medicalIndexNames.length > 0 ? medicalIndexNames[0].name : indexes[0].name;
      console.log(`Exploring index: ${indexName}`);

      // Connect to the index
      const index = pc.index(indexName);

      // Get index stats
      const stats = await index.describeIndexStats();
      console.log('Index statistics:', stats);

      // Calculate total vector count from namespaces
      const totalVectorCount = stats.namespaces ?
        Object.values(stats.namespaces).reduce((sum, ns) => sum + (ns.recordCount || 0), 0) : 0;

      console.log(`Total vector count: ${totalVectorCount}`);
      console.log(`Dimension: ${stats.dimension}`);

      // Fetch a sample vector to examine metadata structure
      if (totalVectorCount > 0) {
        // Query a random vector to see its structure
        const queryResponse = await index.query({
          vector: Array(stats.dimension).fill(0).map(() => Math.random()),
          topK: 1,
          includeMetadata: true,
        });

        console.log('Sample vector metadata structure:');
        console.log(JSON.stringify(queryResponse.matches[0], null, 2));

        // If there's metadata, analyze its structure
        if (queryResponse.matches[0].metadata) {
          console.log('Metadata fields:');
          Object.keys(queryResponse.matches[0].metadata).forEach(key => {
            console.log(`- ${key}: ${typeof queryResponse.matches[0].metadata[key]}`);
          });
        }

        // Check if there's text content
        if (queryResponse.matches[0].metadata && queryResponse.matches[0].metadata.text) {
          console.log('Sample text content:');
          console.log(queryResponse.matches[0].metadata.text.substring(0, 200) + '...');
        }
      }
    } else {
      console.log('No indexes found in this Pinecone account');
    }
  } catch (error) {
    console.error('Error exploring Pinecone:', error);
  }
}

explorePinecone();
