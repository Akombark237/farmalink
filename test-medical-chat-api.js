#!/usr/bin/env node

// Quick test script for medical chat API endpoints
const https = require('https');
const http = require('http');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Test HTTP endpoint
function testEndpoint(url, description) {
  return new Promise((resolve) => {
    const urlObj = new URL(url);
    const client = urlObj.protocol === 'https:' ? https : http;
    
    const req = client.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          if (res.statusCode === 200) {
            log(`✅ ${description}: OK`, 'green');
            log(`   Response: ${JSON.stringify(jsonData, null, 2)}`, 'cyan');
            resolve(true);
          } else {
            log(`❌ ${description}: ${res.statusCode}`, 'red');
            log(`   Response: ${data}`, 'yellow');
            resolve(false);
          }
        } catch (error) {
          log(`❌ ${description}: Invalid JSON response`, 'red');
          log(`   Raw response: ${data}`, 'yellow');
          resolve(false);
        }
      });
    });
    
    req.on('error', (error) => {
      log(`❌ ${description}: ${error.message}`, 'red');
      resolve(false);
    });
    
    req.setTimeout(5000, () => {
      log(`❌ ${description}: Timeout`, 'red');
      req.destroy();
      resolve(false);
    });
  });
}

// Test POST endpoint
function testChatEndpoint(url, message) {
  return new Promise((resolve) => {
    const urlObj = new URL(url);
    const postData = JSON.stringify({
      message: message,
      conversationId: 'test-conversation'
    });
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };
    
    const client = urlObj.protocol === 'https:' ? https : http;
    const req = client.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          if (res.statusCode === 200) {
            log(`✅ Chat Test: OK`, 'green');
            log(`   Question: "${message}"`, 'blue');
            log(`   Response: "${jsonData.response || jsonData.message || 'No response'}"`, 'cyan');
            resolve(true);
          } else {
            log(`❌ Chat Test: ${res.statusCode}`, 'red');
            log(`   Response: ${data}`, 'yellow');
            resolve(false);
          }
        } catch (error) {
          log(`❌ Chat Test: Invalid JSON response`, 'red');
          log(`   Raw response: ${data}`, 'yellow');
          resolve(false);
        }
      });
    });
    
    req.on('error', (error) => {
      log(`❌ Chat Test: ${error.message}`, 'red');
      resolve(false);
    });
    
    req.setTimeout(10000, () => {
      log(`❌ Chat Test: Timeout`, 'red');
      req.destroy();
      resolve(false);
    });
    
    req.write(postData);
    req.end();
  });
}

async function main() {
  log('🧪 Testing Medical Chat API Endpoints...', 'bright');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');
  
  // Test endpoints
  const tests = [
    {
      url: 'http://localhost:3001/health',
      description: 'Gemini Backend Health'
    },
    {
      url: 'http://localhost:3000/api/medical-chat',
      description: 'Next.js Medical Chat Proxy'
    },
    {
      url: 'http://localhost:3000/api/chat-history',
      description: 'Next.js Chat History Proxy'
    }
  ];
  
  log('\n🔍 Testing Health Endpoints...', 'yellow');
  for (const test of tests) {
    await testEndpoint(test.url, test.description);
  }
  
  log('\n🤖 Testing Chat Functionality...', 'yellow');
  
  // Test direct backend chat
  log('\n📡 Testing Direct Backend Chat...', 'magenta');
  await testChatEndpoint('http://localhost:3001/api/medical-chat', 'What is aspirin used for?');
  
  // Test Next.js proxy chat
  log('\n🔄 Testing Next.js Proxy Chat...', 'blue');
  await testChatEndpoint('http://localhost:3000/api/medical-chat', 'What are the side effects of ibuprofen?');
  
  log('\n🎉 API Testing Complete!', 'bright');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');
  log('💡 If all tests pass, your medical chat is ready to use!', 'green');
  log('🌐 Visit: http://localhost:3000/use-pages/medical-assistant', 'blue');
}

main().catch(console.error);
