// Test script to ask about leukemia symptoms
const http = require('http');

async function testLeukemiaQuestion() {
  console.log('🧪 Testing Medical Chatbot - Leukemia Question...\n');

  const question = "What are the symptoms of leukemia?";
  console.log(`📝 Question: ${question}\n`);
  
  try {
    const response = await makeRequest(question);
    
    console.log('✅ SUCCESS! Response received from Qala-Lwazi:\n');
    console.log('📊 Response Details:');
    console.log(`   Session ID: ${response.sessionId}`);
    console.log(`   History Length: ${response.historyLength}`);
    console.log(`   Using RAG: ${response.usingRAG}`);
    console.log(`   Response Length: ${response.responseLength} characters\n`);
    
    console.log('🤖 Qala-Lwazi Response:');
    console.log('=' .repeat(60));
    console.log(response.response);
    console.log('=' .repeat(60));
    
  } catch (error) {
    console.error('❌ ERROR:', error.message);
    console.error('Make sure the server is running on port 3003');
  }
}

function makeRequest(message) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ 
      message,
      userPreferences: {
        useRAG: true,
        detailLevel: 'detailed',
        includeReferences: true
      }
    });
    
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

    console.log('📡 Sending request to http://localhost:3003/api/medical-chat...');

    const req = http.request(options, (res) => {
      let responseData = '';
      
      console.log(`📈 Response status: ${res.statusCode}`);
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          if (res.statusCode === 200) {
            const jsonResponse = JSON.parse(responseData);
            resolve(jsonResponse);
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${responseData}`));
          }
        } catch (error) {
          reject(new Error(`Failed to parse JSON: ${responseData}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(new Error(`Request failed: ${error.message}`));
    });

    req.setTimeout(30000, () => {
      req.destroy();
      reject(new Error('Request timeout after 30 seconds'));
    });

    req.write(data);
    req.end();
  });
}

// Run the test
testLeukemiaQuestion();
