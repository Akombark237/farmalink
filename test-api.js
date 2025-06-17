// test-api.js
// Simple script to test API endpoints

async function testAPI() {
  console.log('🧪 Testing PharmaLink API endpoints...\n');

  const baseUrl = 'http://localhost:3000';
  
  const tests = [
    {
      name: 'Payment Test Endpoint',
      url: `${baseUrl}/api/payments/test`,
      method: 'GET'
    },
    {
      name: 'Search API',
      url: `${baseUrl}/api/search?q=aspirin&type=drugs`,
      method: 'GET'
    },
    {
      name: 'Database Test',
      url: `${baseUrl}/api/test-db`,
      method: 'GET'
    }
  ];

  for (const test of tests) {
    try {
      console.log(`🔍 Testing ${test.name}...`);
      
      const response = await fetch(test.url, {
        method: test.method,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`✅ ${test.name}: SUCCESS`);
        console.log(`   Status: ${response.status}`);
        console.log(`   Response: ${JSON.stringify(data, null, 2).substring(0, 200)}...\n`);
      } else {
        console.log(`❌ ${test.name}: FAILED`);
        console.log(`   Status: ${response.status}`);
        console.log(`   Error: ${response.statusText}\n`);
      }
    } catch (error) {
      console.log(`💥 ${test.name}: ERROR`);
      console.log(`   Error: ${error.message}\n`);
    }
  }

  // Test payment initialization (mock)
  try {
    console.log('🔍 Testing Payment Initialization...');
    
    const paymentData = {
      orderId: 'TEST_ORDER_123',
      amount: 5000,
      currency: 'XAF',
      email: 'test@example.com',
      phone: '+237123456789',
      name: 'Test User',
      description: 'Test payment'
    };

    const response = await fetch(`${baseUrl}/api/payments/initialize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(paymentData)
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Payment Initialization: SUCCESS');
      console.log(`   Status: ${response.status}`);
      console.log(`   Response: ${JSON.stringify(data, null, 2)}\n`);
    } else {
      const errorText = await response.text();
      console.log('❌ Payment Initialization: FAILED');
      console.log(`   Status: ${response.status}`);
      console.log(`   Error: ${errorText}\n`);
    }
  } catch (error) {
    console.log('💥 Payment Initialization: ERROR');
    console.log(`   Error: ${error.message}\n`);
  }

  console.log('🏁 API testing complete!');
}

// Run the tests
testAPI().catch(console.error);
