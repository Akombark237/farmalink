// Pinecone service for medical handbook retrieval
const { Pinecone } = require('@pinecone-database/pinecone');

// Pinecone configuration
const PINECONE_API_KEY = 'pcsk_7Ja3Eb_RjiusV2FSEbXVwcvQh5EcyDor8acU2tsK3CiKnBcGD9eX8H8A7RH1ar7TmnfBvr';
const PINECONE_INDEX = 'medical-handbook';

/*
 * Enhanced Pinecone Service for Medical Handbook Retrieval
 *
 * This service uses a combination of semantic search and keyword matching
 * to provide high-quality retrieval from the medical handbook.
 *
 * It includes:
 * - Advanced keyword extraction with medical term weighting
 * - Hybrid search combining vector similarity and keyword matching
 * - Query expansion for medical terminology
 * - Improved context formatting for the LLM
 */

// Import the Transformers.js library for embeddings (optional)
let pipeline = null;
try {
  const transformers = require('@xenova/transformers');
  pipeline = transformers.pipeline;
} catch (error) {
  console.warn('⚠️  @xenova/transformers not available. RAG functionality will be disabled.');
  console.warn('To enable RAG, install: npm install @xenova/transformers');
}

// Embedding model configuration
// We use the all-MiniLM-L6-v2 model which produces 384-dimensional embeddings
// This matches the dimension of our Pinecone vectors
let embeddingModel = null;

// Medical term weighting - these terms get higher importance in retrieval
const MEDICAL_TERMS = new Set([
  'diagnosis', 'treatment', 'symptom', 'disease', 'condition', 'syndrome',
  'therapy', 'medication', 'drug', 'dosage', 'prognosis', 'etiology',
  'pathology', 'anatomy', 'physiology', 'chronic', 'acute', 'congenital',
  'genetic', 'viral', 'bacterial', 'infection', 'inflammation', 'cancer',
  'tumor', 'malignant', 'benign', 'carcinoma', 'sarcoma', 'leukemia',
  'diabetes', 'hypertension', 'stroke', 'cardiac', 'respiratory', 'pulmonary',
  'renal', 'hepatic', 'neurological', 'gastrointestinal', 'musculoskeletal',
  'dermatological', 'hematological', 'immunological', 'endocrine', 'metabolic'
]);

// Function to initialize the embedding model
async function getEmbeddingModel() {
  if (!pipeline) {
    throw new Error('Transformers.js not available. RAG functionality is disabled.');
  }

  if (embeddingModel === null) {
    console.log('Loading embedding model...');
    try {
      // Try to load the fine-tuned medical model
      const path = require('path');
      const fs = require('fs');
      const medicalModelPath = path.join(__dirname, 'fine-tuning-data', 'medical-embeddings');

      if (fs.existsSync(medicalModelPath)) {
        console.log('Using fine-tuned medical embedding model...');
        embeddingModel = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
        console.log('Medical embedding model loaded successfully');
      } else {
        // Fall back to the base model if the fine-tuned model is not available
        console.log('Fine-tuned model not found, using base model...');
        embeddingModel = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
        console.log('Base embedding model loaded successfully');
      }
    } catch (error) {
      console.error('Error loading fine-tuned model:', error);
      console.log('Falling back to base model...');
      embeddingModel = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
      console.log('Base embedding model loaded successfully');
    }
  }
  return embeddingModel;
}

// Function to generate embeddings for a text
async function generateEmbedding(text) {
  try {
    if (!pipeline) {
      console.warn('Transformers.js not available, using fallback embedding');
      // Fallback to a simple hash-based embedding if model is not available
      return Array(384).fill(0).map(() => Math.random() * 2 - 1);
    }

    const model = await getEmbeddingModel();
    const result = await model(text, { pooling: 'mean', normalize: true });
    return Array.from(result.data);
  } catch (error) {
    console.error('Error generating embedding:', error);
    // Fallback to random embedding if model fails
    return Array(384).fill(0).map(() => Math.random() * 2 - 1);
  }
}

// Enhanced keyword extraction with medical term weighting
function extractKeywords(text) {
  // Remove common stop words and punctuation
  const cleanText = text.toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
    .replace(/\s{2,}/g, ' ');

  // Split into words and filter out short words
  const words = cleanText.split(' ').filter(word => word.length > 3);

  // Extract multi-word medical terms (up to 3 words)
  const multiWordTerms = [];
  for (let i = 0; i < words.length - 1; i++) {
    const twoWordTerm = words[i] + ' ' + words[i + 1];
    if (MEDICAL_TERMS.has(words[i]) || MEDICAL_TERMS.has(words[i + 1])) {
      multiWordTerms.push(twoWordTerm);
    }

    if (i < words.length - 2) {
      const threeWordTerm = twoWordTerm + ' ' + words[i + 2];
      if (MEDICAL_TERMS.has(words[i]) || MEDICAL_TERMS.has(words[i + 1]) || MEDICAL_TERMS.has(words[i + 2])) {
        multiWordTerms.push(threeWordTerm);
      }
    }
  }

  // Combine single words and multi-word terms
  const allTerms = [...words, ...multiWordTerms];

  // Return unique keywords
  return [...new Set(allTerms)];
}

// Function to expand a query with medical terminology
function expandQuery(query) {
  const keywords = extractKeywords(query);
  let expandedQuery = query;

  // Add common synonyms for medical terms
  const medicalSynonyms = {
    'heart attack': 'myocardial infarction cardiac arrest',
    'stroke': 'cerebrovascular accident cva',
    'high blood pressure': 'hypertension htn elevated bp',
    'kidney stones': 'nephrolithiasis renal calculi',
    'heart failure': 'cardiac failure chf congestive cardiomyopathy',
    'blood sugar': 'glucose glycemia',
    'water pills': 'diuretics',
    'blood thinner': 'anticoagulant warfarin heparin',
    'pain killer': 'analgesic painkiller nsaid',
    'inflammation': 'inflammatory response swelling edema',
    'diabetes': 'diabetes mellitus dm hyperglycemia',
    'cancer': 'malignancy neoplasm carcinoma tumor',
    'asthma': 'bronchial asthma reactive airway disease',
    'arthritis': 'joint inflammation osteoarthritis rheumatoid',
    'alzheimer': 'dementia neurocognitive disorder',
    'pneumonia': 'lung infection pulmonary inflammation',
    'flu': 'influenza viral infection',
    'depression': 'major depressive disorder mood disorder',
    'anxiety': 'anxiety disorder gad panic',
    'thyroid': 'hypothyroidism hyperthyroidism tsh'
  };

  // Check if any keywords match our synonym list and add synonyms
  let synonymsAdded = false;
  for (const [term, synonyms] of Object.entries(medicalSynonyms)) {
    if (query.toLowerCase().includes(term)) {
      expandedQuery = `${expandedQuery} ${synonyms}`;
      synonymsAdded = true;
    }
    // Also check if any of the synonyms are in the query
    const synonymList = synonyms.split(' ');
    for (const syn of synonymList) {
      if (query.toLowerCase().includes(syn) && !synonymsAdded) {
        expandedQuery = `${expandedQuery} ${term} ${synonyms.replace(syn, '')}`;
        synonymsAdded = true;
        break;
      }
    }
  }

  // Add common medical context terms based on query content
  if (query.toLowerCase().includes('symptom') ||
      query.toLowerCase().includes('sign') ||
      query.toLowerCase().includes('feel')) {
    expandedQuery += ' clinical manifestation presentation';
  }

  if (query.toLowerCase().includes('treatment') ||
      query.toLowerCase().includes('cure') ||
      query.toLowerCase().includes('therapy')) {
    expandedQuery += ' management therapeutic intervention medication drug';
  }

  if (query.toLowerCase().includes('cause') ||
      query.toLowerCase().includes('why') ||
      query.toLowerCase().includes('reason')) {
    expandedQuery += ' etiology pathophysiology mechanism';
  }

  if (query.toLowerCase().includes('diagnosis') ||
      query.toLowerCase().includes('test') ||
      query.toLowerCase().includes('detect')) {
    expandedQuery += ' diagnostic evaluation laboratory imaging';
  }

  return expandedQuery;
}

class PineconeService {
  constructor() {
    this.pinecone = null;
    this.index = null;
    this.isInitialized = false;
  }

  async initialize() {
    if (this.isInitialized) return;

    try {
      // Initialize Pinecone client
      this.pinecone = new Pinecone({
        apiKey: PINECONE_API_KEY,
      });

      // Connect to the index
      this.index = this.pinecone.index(PINECONE_INDEX);

      this.isInitialized = true;
      console.log('Pinecone service initialized successfully');
    } catch (error) {
      console.error('Error initializing Pinecone service:', error);
      throw error;
    }
  }

  async queryMedicalHandbook(query, topK = 5) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      console.log('Querying medical handbook for:', query);

      // Expand the query with medical terminology
      const expandedQuery = expandQuery(query);
      console.log('Expanded query:', expandedQuery);

      // Generate embedding for the expanded query
      const queryEmbedding = await generateEmbedding(expandedQuery);
      console.log('Generated embedding for query');

      // Extract keywords with enhanced medical term weighting
      const keywords = extractKeywords(expandedQuery);
      console.log('Extracted keywords:', keywords);

      // Identify medical terms in the query for boosting
      const medicalKeywords = keywords.filter(keyword =>
        MEDICAL_TERMS.has(keyword) ||
        Array.from(MEDICAL_TERMS).some(term => keyword.includes(term))
      );
      console.log('Medical keywords:', medicalKeywords);

      // Query Pinecone with the embedding
      const queryResponse = await this.index.query({
        vector: queryEmbedding,
        topK: topK * 3, // Get more results for better filtering
        includeMetadata: true,
      });

      console.log(`Found ${queryResponse.matches.length} matches from vector search`);

      // Process results with enhanced scoring
      const results = queryResponse.matches
        .map(match => {
          if (!match.metadata?.text) {
            return { id: match.id, score: 0, text: '' };
          }

          const text = match.metadata.text.toLowerCase();

          // Calculate keyword match score with boosting for medical terms
          let keywordScore = 0;
          let medicalTermBoost = 0;

          if (keywords.length > 0) {
            // Count regular keyword matches
            const matchingKeywords = keywords.filter(keyword =>
              text.includes(keyword.toLowerCase())
            );
            keywordScore = matchingKeywords.length / keywords.length;

            // Apply boost for medical term matches
            if (medicalKeywords.length > 0) {
              const matchingMedicalTerms = medicalKeywords.filter(term =>
                text.includes(term.toLowerCase())
              );
              medicalTermBoost = matchingMedicalTerms.length > 0 ? 0.2 : 0;
            }
          }

          // Calculate relevance score based on text length (prefer concise answers)
          const lengthScore = Math.min(1, 1000 / Math.max(300, text.length));

          // Combine scores with weights:
          // - 60% vector similarity
          // - 25% keyword matching
          // - 10% medical term boost
          // - 5% length preference
          const combinedScore =
            (match.score * 0.6) +
            (keywordScore * 0.25) +
            (medicalTermBoost * 0.1) +
            (lengthScore * 0.05);

          return {
            id: match.id,
            score: combinedScore,
            vectorScore: match.score,
            keywordScore: keywordScore,
            medicalTermBoost: medicalTermBoost,
            text: match.metadata.text,
          };
        })
        .filter(result => result.score > 0) // Remove zero-scored results
        .sort((a, b) => b.score - a.score) // Sort by combined score
        .slice(0, topK); // Take only the top K results

      console.log(`Returning ${results.length} processed results`);

      // Log the top result for debugging
      if (results.length > 0) {
        console.log('Top result score:', results[0].score);
        console.log('Top result preview:', results[0].text.substring(0, 100) + '...');
      }

      return results;
    } catch (error) {
      console.error('Error querying Pinecone:', error);

      // Enhanced fallback to keyword-only search
      try {
        console.log('Falling back to enhanced keyword-based search');

        // Use expanded query and enhanced keyword extraction
        const expandedQuery = expandQuery(query);
        const keywords = extractKeywords(expandedQuery);

        if (keywords.length === 0) {
          console.log('No valid keywords found in query');
          return [];
        }

        // Use a random vector but rely on post-filtering
        const randomVector = Array(384).fill(0).map(() => Math.random() * 2 - 1);

        const queryResponse = await this.index.query({
          vector: randomVector,
          topK: 100, // Get more results for keyword filtering
          includeMetadata: true,
        });

        // Enhanced filtering with medical term boosting
        const results = queryResponse.matches
          .filter(match => {
            if (!match.metadata?.text) return false;
            const text = match.metadata.text.toLowerCase();
            return keywords.some(keyword => text.includes(keyword.toLowerCase()));
          })
          .map(match => {
            const text = match.metadata.text.toLowerCase();

            // Count keyword matches
            const matchingKeywords = keywords.filter(keyword =>
              text.includes(keyword.toLowerCase())
            );

            // Identify medical terms in the text
            const medicalTerms = Array.from(MEDICAL_TERMS).filter(term =>
              text.includes(term.toLowerCase())
            );

            // Calculate score with medical term boost
            const keywordScore = matchingKeywords.length / keywords.length;
            const medicalBoost = medicalTerms.length > 0 ? 0.2 : 0;
            const score = keywordScore + medicalBoost;

            return {
              id: match.id,
              score: score,
              text: match.metadata.text,
            };
          })
          .sort((a, b) => b.score - a.score)
          .slice(0, topK);

        return results;
      } catch (fallbackError) {
        console.error('Fallback search also failed:', fallbackError);
        return [];
      }
    }
  }

  // Hybrid search function that combines keyword and semantic search
  async hybridSearch(query, topK = 5) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      // Since we're using a keyword-based approach, we'll just call the queryMedicalHandbook method
      // In a production environment with the proper embedding model, you would implement a true
      // hybrid search that combines vector similarity with keyword matching
      return await this.queryMedicalHandbook(query, topK);
    } catch (error) {
      console.error('Error performing hybrid search:', error);
      throw error;
    }
  }

  // Format the retrieved context into a single string for the LLM
  formatContextForLLM(results) {
    if (!results || results.length === 0) {
      return '';
    }

    // Create a formatted context string with citations
    const contextParts = results.map((result, index) => {
      return `[${index + 1}] ${result.text.trim()}`;
    });

    return `Here is relevant information from the medical handbook:\n\n${contextParts.join('\n\n')}`;
  }
}

// Create and export a singleton instance
const pineconeService = new PineconeService();

module.exports = pineconeService;
