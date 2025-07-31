import axios from 'axios';

async function testCreatePlan() {
  try {
    console.log('Testing create-test-plan endpoint...');
    
    const response = await axios.post('http://localhost:3001/api/create-test-plan', {
      userId: 'uSICth22JNTHyHWJ1Bdrj5iIbGk2'
    });
    
    console.log('✅ Success!');
    console.log('Response:', response.data);
    
  } catch (error) {
    console.log('❌ Error:');
    console.log('Status:', error.response?.status);
    console.log('Message:', error.response?.data?.message || error.message);
  }
}

testCreatePlan(); 