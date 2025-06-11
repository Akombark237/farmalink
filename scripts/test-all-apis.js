#!/usr/bin/env node

// Comprehensive API testing script for PharmaLink
// Tests all endpoints to ensure they're working correctly

import fetch from 'node-fetch';

const BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001';
let authToken = null;
let pharmacyToken = null;

console.log('🧪 PharmaLink API Testing Suite');
console.log('================================');
console.log(`Base URL: ${BASE_URL}`);
console.log('');

// Helper function to make API requests
async function apiRequest(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    return {
      status: response.status,
      ok: response.ok,
      data
    };
  } catch (error) {
    return {
      status: 0,
      ok: false,
      error: error.message
    };
  }
}

// Test results tracking
const testResults = {
  passed: 0,
  failed: 0,
  tests: []
};

function logTest(name, passed, details = '') {
  const status = passed ? '✅' : '❌';
  console.log(`${status} ${name}${details ? ' - ' + details : ''}`);
  
  testResults.tests.push({ name, passed, details });
  if (passed) {
    testResults.passed++;
  } else {
    testResults.failed++;
  }
}

// Test 1: Health Check
async function testHealthCheck() {
  console.log('\n🏥 Testing Health Check...');
  
  const response = await apiRequest('/api/health');
  
  if (response.ok && response.data.status) {
    logTest('Health Check', true, `Status: ${response.data.status}`);
    return true;
  } else {
    logTest('Health Check', false, `Status: ${response.status}`);
    return false;
  }
}

// Test 2: Authentication
async function testAuthentication() {
  console.log('\n🔐 Testing Authentication...');
  
  // Test login
  const loginResponse = await apiRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: 'patient@pharmalink.com',
      password: 'password123'
    })
  });
  
  if (loginResponse.ok && loginResponse.data.success) {
    authToken = loginResponse.data.data.token;
    logTest('Patient Login', true, 'Token received');
  } else {
    logTest('Patient Login', false, loginResponse.data?.error || 'Login failed');
    return false;
  }
  
  // Test pharmacy login
  const pharmacyLoginResponse = await apiRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: 'pharmacy@pharmalink.com',
      password: 'password123'
    })
  });
  
  if (pharmacyLoginResponse.ok && pharmacyLoginResponse.data.success) {
    pharmacyToken = pharmacyLoginResponse.data.data.token;
    logTest('Pharmacy Login', true, 'Token received');
  } else {
    logTest('Pharmacy Login', false, pharmacyLoginResponse.data?.error || 'Login failed');
  }
  
  // Test token verification
  const verifyResponse = await apiRequest('/api/auth/verify', {
    headers: {
      'Authorization': `Bearer ${authToken}`
    }
  });
  
  if (verifyResponse.ok && verifyResponse.data.success) {
    logTest('Token Verification', true, `User: ${verifyResponse.data.data.user.email}`);
  } else {
    logTest('Token Verification', false, verifyResponse.data?.error || 'Verification failed');
  }
  
  return true;
}

// Test 3: Pharmacies API
async function testPharmaciesAPI() {
  console.log('\n🏪 Testing Pharmacies API...');
  
  // Test basic pharmacy list
  const pharmaciesResponse = await apiRequest('/api/pharmacies');
  
  if (pharmaciesResponse.ok && pharmaciesResponse.data.success) {
    const pharmacyCount = pharmaciesResponse.data.data.length;
    logTest('Pharmacies List', true, `${pharmacyCount} pharmacies found`);
  } else {
    logTest('Pharmacies List', false, pharmaciesResponse.data?.error || 'Request failed');
  }
  
  // Test pharmacy search
  const searchResponse = await apiRequest('/api/pharmacies?search=francaise');
  
  if (searchResponse.ok && searchResponse.data.success) {
    const results = searchResponse.data.data.length;
    logTest('Pharmacy Search', true, `${results} results for "francaise"`);
  } else {
    logTest('Pharmacy Search', false, searchResponse.data?.error || 'Search failed');
  }
  
  // Test with inventory
  const inventoryResponse = await apiRequest('/api/pharmacies?includeInventory=true&limit=1');
  
  if (inventoryResponse.ok && inventoryResponse.data.success) {
    const hasInventory = inventoryResponse.data.data[0]?.medications?.length > 0;
    logTest('Pharmacy with Inventory', hasInventory, hasInventory ? 'Medications included' : 'No medications');
  } else {
    logTest('Pharmacy with Inventory', false, inventoryResponse.data?.error || 'Request failed');
  }
}

// Test 4: Medications API
async function testMedicationsAPI() {
  console.log('\n💊 Testing Medications API...');
  
  // Test basic medications list
  const medicationsResponse = await apiRequest('/api/medications');
  
  if (medicationsResponse.ok && medicationsResponse.data.success) {
    const medicationCount = medicationsResponse.data.data.length;
    logTest('Medications List', true, `${medicationCount} medications found`);
  } else {
    logTest('Medications List', false, medicationsResponse.data?.error || 'Request failed');
  }
  
  // Test medication search
  const searchResponse = await apiRequest('/api/medications?search=paracetamol');
  
  if (searchResponse.ok && searchResponse.data.success) {
    const results = searchResponse.data.data.length;
    logTest('Medication Search', true, `${results} results for "paracetamol"`);
  } else {
    logTest('Medication Search', false, searchResponse.data?.error || 'Search failed');
  }
  
  // Test category filter
  const categoryResponse = await apiRequest('/api/medications?category=Pain Relief');
  
  if (categoryResponse.ok && categoryResponse.data.success) {
    const results = categoryResponse.data.data.length;
    logTest('Category Filter', true, `${results} pain relief medications`);
  } else {
    logTest('Category Filter', false, categoryResponse.data?.error || 'Filter failed');
  }
}

// Test 5: Search API
async function testSearchAPI() {
  console.log('\n🔍 Testing Search API...');
  
  // Test drug search
  const drugSearchResponse = await apiRequest('/api/search?query=paracetamol&type=drugs');
  
  if (drugSearchResponse.ok && drugSearchResponse.data.success) {
    const results = drugSearchResponse.data.data.length;
    logTest('Drug Search', true, `${results} drugs found for "paracetamol"`);
  } else {
    logTest('Drug Search', false, drugSearchResponse.data?.error || 'Search failed');
  }
  
  // Test pharmacy search
  const pharmacySearchResponse = await apiRequest('/api/search?query=pharmacie&type=pharmacies');
  
  if (pharmacySearchResponse.ok && pharmacySearchResponse.data.success) {
    const results = pharmacySearchResponse.data.data.length;
    logTest('Pharmacy Search', true, `${results} pharmacies found for "pharmacie"`);
  } else {
    logTest('Pharmacy Search', false, pharmacySearchResponse.data?.error || 'Search failed');
  }
}

// Test 6: Orders API (Protected)
async function testOrdersAPI() {
  console.log('\n📦 Testing Orders API...');
  
  if (!authToken) {
    logTest('Orders API', false, 'No auth token available');
    return;
  }
  
  // Test orders list
  const ordersResponse = await apiRequest('/api/orders', {
    headers: {
      'Authorization': `Bearer ${authToken}`
    }
  });
  
  if (ordersResponse.ok && ordersResponse.data.success) {
    const orderCount = ordersResponse.data.data.length;
    logTest('Orders List', true, `${orderCount} orders found`);
  } else {
    logTest('Orders List', false, ordersResponse.data?.error || 'Request failed');
  }
  
  // Test orders with status filter
  const pendingOrdersResponse = await apiRequest('/api/orders?status=pending', {
    headers: {
      'Authorization': `Bearer ${authToken}`
    }
  });
  
  if (pendingOrdersResponse.ok && pendingOrdersResponse.data.success) {
    const pendingCount = pendingOrdersResponse.data.data.length;
    logTest('Pending Orders Filter', true, `${pendingCount} pending orders`);
  } else {
    logTest('Pending Orders Filter', false, pendingOrdersResponse.data?.error || 'Filter failed');
  }
}

// Test 7: Vendor Dashboard (Protected)
async function testVendorDashboard() {
  console.log('\n📊 Testing Vendor Dashboard...');
  
  if (!pharmacyToken) {
    logTest('Vendor Dashboard', false, 'No pharmacy token available');
    return;
  }
  
  // Test vendor dashboard
  const dashboardResponse = await apiRequest('/api/vendor/dashboard', {
    headers: {
      'Authorization': `Bearer ${pharmacyToken}`
    }
  });
  
  if (dashboardResponse.ok && dashboardResponse.data.success) {
    const data = dashboardResponse.data.data;
    const hasStats = data.statistics && data.pharmacy;
    logTest('Vendor Dashboard', hasStats, hasStats ? 'Dashboard data loaded' : 'Incomplete data');
  } else {
    logTest('Vendor Dashboard', false, dashboardResponse.data?.error || 'Request failed');
  }
}

// Test 8: Error Handling
async function testErrorHandling() {
  console.log('\n⚠️  Testing Error Handling...');
  
  // Test invalid endpoint
  const invalidResponse = await apiRequest('/api/nonexistent');
  logTest('404 Error Handling', invalidResponse.status === 404, `Status: ${invalidResponse.status}`);
  
  // Test unauthorized access
  const unauthorizedResponse = await apiRequest('/api/orders');
  logTest('401 Error Handling', unauthorizedResponse.status === 401, `Status: ${unauthorizedResponse.status}`);
  
  // Test invalid login
  const invalidLoginResponse = await apiRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: 'invalid@email.com',
      password: 'wrongpassword'
    })
  });
  logTest('Invalid Login Handling', invalidLoginResponse.status === 401, `Status: ${invalidLoginResponse.status}`);
}

// Main test runner
async function runAllTests() {
  console.log('Starting comprehensive API tests...\n');
  
  try {
    await testHealthCheck();
    await testAuthentication();
    await testPharmaciesAPI();
    await testMedicationsAPI();
    await testSearchAPI();
    await testOrdersAPI();
    await testVendorDashboard();
    await testErrorHandling();
    
    // Print summary
    console.log('\n📊 Test Summary');
    console.log('================');
    console.log(`✅ Passed: ${testResults.passed}`);
    console.log(`❌ Failed: ${testResults.failed}`);
    console.log(`📊 Total: ${testResults.passed + testResults.failed}`);
    console.log(`📈 Success Rate: ${((testResults.passed / (testResults.passed + testResults.failed)) * 100).toFixed(1)}%`);
    
    if (testResults.failed === 0) {
      console.log('\n🎉 All tests passed! Your PharmaLink API is working perfectly!');
    } else {
      console.log('\n⚠️  Some tests failed. Please check the issues above.');
    }
    
  } catch (error) {
    console.error('❌ Test suite failed:', error);
    process.exit(1);
  }
}

// Run tests if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllTests();
}

export default runAllTests;
