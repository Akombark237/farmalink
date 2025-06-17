// Simple test script for the medical chatbot API
const https = require('http');

async function testMedicalChat() {
  console.log('🧪 Testing Medical Chatbot API...\n');

  const testQuestions = [
    "What are the symptoms of diabetes?",
    "How can I prevent heart disease?",
    "What is the difference between Type 1 and Type 2 diabetes?"
  ];

  for (let i = 0; i < testQuestions.length; i++) {
    const question = testQuestions[i];
    console.log(`📝 Test ${i + 1}: ${question}`);
    
    try {
      const response = await makeRequest(question);
      console.log('✅ Response received:');
      console.log(`📊 Session ID: ${response.sessionId}`);
      console.log(`📈 History Length: ${response.historyLength}`);
      console.log(`🔍 Using RAG: ${response.usingRAG}`);
      console.log(`📝 Response Length: ${response.responseLength} characters`);
      console.log(`🤖 Response: ${response.response.substring(0, 200)}...`);
      console.log('\n' + '='.repeat(80) + '\n');
    } catch (error) {
      console.error(`❌ Error for question ${i + 1}:`, error.message);
      console.log('\n' + '='.repeat(80) + '\n');
    }
  }
}

function makeRequest(message) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ message });
    
    const options = {
      hostname: 'localhost',
      port: 3003,
      path: '/api/medical-chat',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonResponse = JSON.parse(responseData);
          resolve(jsonResponse);
        } catch (error) {
          reject(new Error(`Failed to parse JSON: ${responseData}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

// Run the test
testMedicalChat().catch(console.error);
