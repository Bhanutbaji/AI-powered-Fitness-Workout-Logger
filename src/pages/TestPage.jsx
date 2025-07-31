import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const TestPage = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState('uSICth22JNTHyHWJ1Bdrj5iIbGk2');
  const [planId, setPlanId] = useState('AaqdXSaNlB8ZzJofpFSM');
  const [firestoreData, setFirestoreData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [creatingPlan, setCreatingPlan] = useState(false);

  const handleNavigate = () => {
    navigate(`/plan/${userId}/${planId}`);
  };

  const checkFirestoreData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3001/api/test-data');
      setFirestoreData(response.data);
    } catch (error) {
      console.error('Error checking Firestore data:', error);
      setFirestoreData({ error: error.response?.data?.message || error.message });
    } finally {
      setLoading(false);
    }
  };

  const createTestPlan = async () => {
    try {
      setCreatingPlan(true);
      const response = await axios.post('http://localhost:3001/api/create-test-plan', {
        userId: userId
      });
      
      if (response.data.success) {
        setPlanId(response.data.planId);
        alert(`Test plan created successfully!\nPlan ID: ${response.data.planId}\n\nYou can now use this Plan ID to test the dashboard.`);
        // Refresh the data
        await checkFirestoreData();
      }
    } catch (error) {
      console.error('Error creating test plan:', error);
      alert('Error creating test plan: ' + (error.response?.data?.message || error.message));
    } finally {
      setCreatingPlan(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1>Test Page - Plan Dashboard Navigation</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>
          User ID:
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            style={{ marginLeft: '10px', padding: '5px', width: '200px' }}
          />
        </label>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>
          Plan ID:
          <input
            type="text"
            value={planId}
            onChange={(e) => setPlanId(e.target.value)}
            style={{ marginLeft: '10px', padding: '5px', width: '200px' }}
          />
        </label>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={checkFirestoreData}
          disabled={loading}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: loading ? '#ccc' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginRight: '10px'
          }}
        >
          {loading ? 'Checking...' : 'Check Firestore Data'}
        </button>

        <button
          onClick={createTestPlan}
          disabled={creatingPlan}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: creatingPlan ? '#ccc' : '#ffc107',
            color: 'black',
            border: 'none',
            borderRadius: '5px',
            cursor: creatingPlan ? 'not-allowed' : 'pointer',
            marginRight: '10px'
          }}
        >
          {creatingPlan ? 'Creating...' : 'Create Test Plan'}
        </button>

        <button
          onClick={handleNavigate}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Navigate to Plan Dashboard
        </button>
      </div>

      {firestoreData && (
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
          <h3>Firestore Data:</h3>
          {firestoreData.error ? (
            <div style={{ color: 'red' }}>
              <p><strong>Error:</strong> {firestoreData.error}</p>
            </div>
          ) : (
            <div>
              <p><strong>Available Users and Plans:</strong></p>
              {firestoreData.users && firestoreData.users.length > 0 ? (
                firestoreData.users.map((user, index) => (
                  <div key={index} style={{ marginBottom: '10px', padding: '10px', border: '1px solid #ddd', borderRadius: '3px' }}>
                    <p><strong>User ID:</strong> {user.userId}</p>
                    <p><strong>Plans:</strong></p>
                    {user.plans.length > 0 ? (
                      <ul>
                        {user.plans.map((plan, planIndex) => (
                          <li key={planIndex}>
                            <strong>Plan ID:</strong> {plan.planId}
                            <br />
                            <strong>Data:</strong> {JSON.stringify(plan.data, null, 2)}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p style={{ color: '#666' }}>No plans found for this user</p>
                    )}
                  </div>
                ))
              ) : (
                <p style={{ color: '#666' }}>No users found in Firestore</p>
              )}
            </div>
          )}
        </div>
      )}

      <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
        <h3>Instructions:</h3>
        <ol>
          <li>Click "Check Firestore Data" to see what data exists in your database</li>
          <li>If you have real data, copy the User ID and Plan ID from the results above</li>
          <li>If no data exists, click "Create Test Plan" to create a test plan for your user</li>
          <li>Make sure you have a .env file with your OpenAI API key</li>
          <li><strong>IMPORTANT:</strong> Start the backend server first:</li>
          <ul>
            <li><strong>Option 1:</strong> Double-click <code>start-backend.bat</code> (Windows)</li>
            <li><strong>Option 2:</strong> Run <code>powershell -ExecutionPolicy Bypass -File start-backend.ps1</code></li>
            <li><strong>Option 3:</strong> Manual: <code>cd backend && node index.js</code></li>
          </ul>
          <li>Wait for "Server is running on port 3001" message</li>
          <li>Click "Navigate to Plan Dashboard" to test the functionality</li>
        </ol>
        
        <h3>Current Status:</h3>
        <div style={{ backgroundColor: '#d4edda', padding: '10px', borderRadius: '5px', marginTop: '10px' }}>
          <p><strong>✅ User Found:</strong> Your user ID <code>{userId}</code> exists in Firestore</p>
          <p><strong>⚠️ No Plans:</strong> This user has no workout plans yet</p>
          <p><strong>💡 Solution:</strong> Click "Create Test Plan" to create a test plan and get a valid Plan ID</p>
        </div>

        <h3>Backend API Endpoints:</h3>
        <ul>
          <li><code>GET /api/test-data</code> - List all users and plans in Firestore</li>
          <li><code>POST /api/create-test-plan</code> - Create a test plan for a user</li>
          <li><code>GET /api/plan/:userId/:planId</code> - Fetch plan details</li>
          <li><code>POST /api/generate-plan</code> - Generate workout plan with OpenAI</li>
        </ul>
      </div>
    </div>
  );
};

export default TestPage; 