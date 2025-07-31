// Test script for backend API endpoints
import axios from 'axios';

const BASE_URL = 'http://localhost:3001';

async function testBackend() {
  console.log('Testing backend API endpoints...\n');

  try {
    // Test 1: Check if server is running
    console.log('1. Testing server health...');
    const healthResponse = await axios.get(`${BASE_URL}/`);
    console.log('✅ Server is running:', healthResponse.data);
    console.log('');

    // Test 2: Test plan details endpoint (this will fail if no data exists)
    console.log('2. Testing plan details endpoint...');
    try {
      const planResponse = await axios.get(`${BASE_URL}/api/plan/test-user-123/test-plan-456`);
      console.log('✅ Plan details endpoint working:', planResponse.data);
    } catch (error) {
      if (error.response?.status === 404) {
        console.log('⚠️  Plan not found (expected for test data)');
      } else {
        console.log('❌ Plan details endpoint error:', error.message);
      }
    }
    console.log('');

    // Test 3: Test generate plan endpoint
    console.log('3. Testing generate plan endpoint...');
    try {
      const generateResponse = await axios.post(`${BASE_URL}/api/generate-plan`, {
        userId: 'test-user-123',
        planId: 'test-plan-456'
      });
      console.log('✅ Generate plan endpoint working:', generateResponse.data);
    } catch (error) {
      console.log('❌ Generate plan endpoint error:', error.response?.data?.message || error.message);
    }

  } catch (error) {
    console.log('❌ Backend server is not running or not accessible');
    console.log('Error:', error.message);
    console.log('\nTo start the backend:');
    console.log('1. cd backend');
    console.log('2. node index.js');
  }
}

testBackend(); 