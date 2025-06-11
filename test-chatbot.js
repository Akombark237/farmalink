// Test chatbot API
const testChatbot = async () => {
  try {
    console.log('Testing chatbot API...');
    
    const response = await fetch('http://localhost:3002/api/medical-chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Hello, can you help me with diabetes symptoms?',
        userPreferences: {
          useRAG: true,
          detailLevel: 'balanced',
          creativity: 'balanced',
          responseLength: 'medium',
          includeReferences: false
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error:', errorData);
      return;
    }

    const data = await response.json();
    console.log('✅ Chatbot Response:');
    console.log('Session ID:', data.sessionId);
    console.log('Response:', data.response);
    console.log('Using RAG:', data.usingRAG);
    
  } catch (error) {
    console.error('❌ Error testing chatbot:', error.message);
  }
};

testChatbot();
