#!/usr/bin/env node

// Node.js script to check PharmaLink services status
const http = require('http');
const https = require('https');

console.log('🔍 PharmaLink Services Health Check');
console.log('=================================');

// Function to check if a URL is responding
function checkUrl(url, serviceName) {
  return new Promise((resolve) => {
    const protocol = url.startsWith('https') ? https : http;
    const request = protocol.get(url, (res) => {
      if (res.statusCode === 200) {
        console.log(`✅ ${serviceName} is ONLINE`);
        resolve(true);
      } else {
        console.log(`⚠️  ${serviceName} responded with status: ${res.statusCode}`);
        resolve(false);
      }
    });

    request.on('error', () => {
      console.log(`❌ ${serviceName} is OFFLINE`);
      resolve(false);
    });

    request.setTimeout(5000, () => {
      console.log(`❌ ${serviceName} timed out`);
      request.destroy();
      resolve(false);
    });
  });
}

// Function to check if port is in use (simplified check)
function checkPort(port, serviceName) {
  return new Promise((resolve) => {
    const server = require('net').createServer();
    
    server.listen(port, () => {
      server.close();
      console.log(`❌ Port ${port} (${serviceName}) is not in use`);
      resolve(false);
    });

    server.on('error', () => {
      console.log(`✅ Port ${port} (${serviceName}) is in use`);
      resolve(true);
    });
  });
}

async function main() {
  console.log('');
  console.log('📊 Checking Ports...');
  
  const port3001 = await checkPort(3001, 'Next.js Web App');
  const port3003 = await checkPort(3003, 'Chatbot API');

  console.log('');
  console.log('🌐 Checking Web Services...');

  // Check multiple possible ports for the web app
  let webApp = false;
  let webAppPort = null;

  for (const port of [3000, 3001, 3002, 3003]) {
    if (port === 3003) continue; // Skip chatbot port
    const isRunning = await checkUrl(`http://localhost:${port}`, `PharmaLink Web App (Port ${port})`);
    if (isRunning) {
      webApp = true;
      webAppPort = port;
      break;
    }
  }

  const chatbotApi = await checkUrl('http://localhost:3003/health', 'Qala-Lwazi Chatbot API');

  console.log('');
  console.log('📋 Summary:');
  console.log('==========');

  if (webApp && chatbotApi) {
    console.log('🎉 ALL SERVICES ARE RUNNING PERFECTLY!');
    console.log('');
    console.log('🔗 Access your application:');
    console.log(`   Web App: http://localhost:${webAppPort || '3001'}`);
    console.log('   Chatbot API: http://localhost:3003');
    console.log('   Health Check: http://localhost:3003/health');
  } else if (webApp && !chatbotApi) {
    console.log('⚠️  WEB APP IS RUNNING, BUT CHATBOT IS OFFLINE');
    console.log('');
    console.log('🔧 To fix chatbot:');
    console.log('   Run: npm run dev:chatbot');
    console.log('   Or: npm run dev:full');
  } else if (!webApp && chatbotApi) {
    console.log('⚠️  CHATBOT IS RUNNING, BUT WEB APP IS OFFLINE');
    console.log('');
    console.log('🔧 To fix web app:');
    console.log('   Run: npm run dev');
  } else {
    console.log('❌ BOTH SERVICES ARE OFFLINE');
    console.log('');
    console.log('🚀 To start everything:');
    console.log('   Run: npm run dev:full');
    console.log('   Or: start-pharmalink.bat');
  }

  console.log('');
  console.log('💡 Quick Commands:');
  console.log('   npm run dev:full     - Start everything');
  console.log('   npm run dev          - Start web app only');
  console.log('   npm run dev:chatbot  - Start chatbot only');
  console.log('');

  // Check if environment files exist
  console.log('📁 Checking Configuration...');
  const fs = require('fs');
  const path = require('path');
  
  const envPath = path.join(__dirname, 'phamarlink', 'gemini-proxy', '.env');
  if (fs.existsSync(envPath)) {
    console.log('✅ Environment file found');
  } else {
    console.log('⚠️  Environment file missing:', envPath);
    console.log('   Create .env file with your API keys');
  }

  console.log('');
  process.exit(webApp && chatbotApi ? 0 : 1);
}

main().catch(console.error);
