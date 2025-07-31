import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";

const PlanDashboard = () => {
  const { userId, planId } = useParams();
const { currentUser } = useAuth();
  const [completedDays, setCompletedDays] = useState([]);
  const [planDetails, setPlanDetails] = useState(null);
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    const fetchPlanDetailsAndGenerate = async () => {
      // Validate that userId and planId are available
      if (!userId || !planId) {
        setError("Missing user ID or plan ID");
        return;
      }

      try {
        // Fetch plan details from backend API instead of directly from Firestore
        const response = await axios.get(`http://localhost:3001/api/plan/${userId}/${planId}`);
        console.log(response)
        
        if (response.data.success) {
          setPlanDetails(response.data.plan);
          
          // Automatically generate workout plan based on plan details
          await generateWorkoutPlanAutomatically();
        } else {
          setError("Failed to fetch plan details");
        }
      } catch (err) {
        console.error("Error fetching workout plan:", err);
        if (err.response?.status === 404) {
          setError("Workout plan not found. Please check your User ID and Plan ID.");
        } else {
          setError("Error fetching workout plan: " + (err.response?.data?.message || err.message));
        }
      }
    };

    fetchPlanDetailsAndGenerate();
  }, [userId, planId]);

  const generateWorkoutPlanAutomatically = async () => {
    try {
      setLoading(true);
      setError(null);
      setShowFallback(false);
      
      // Try AI generation first
      const res = await axios.post("http://localhost:3001/api/generate-plan", {
        userId,
        planId,
      });
      setGeneratedPlan(res.data.plan);
    } catch (err) {
      console.error("Error generating workout plan:", err);
      
      // If AI fails, automatically fall back to basic plan
      if (err.response?.status === 429 || 
          err.response?.data?.message?.includes("invalid response format") ||
          err.response?.data?.message?.includes("JSON")) {
        
        // Show user-friendly message about AI issues
        setError(
          <div>
            <h4>AI Generation Unavailable</h4>
            <p>We couldn't generate an AI workout plan due to technical issues. Using our guaranteed basic workout plan instead!</p>
            <p><strong>Status:</strong> Generating basic workout plan...</p>
          </div>
        );
        
        // Automatically generate basic plan
        try {
          const basicRes = await axios.post("http://localhost:3001/api/generate-basic-plan", {
            userId,
            planId,
          });
          setGeneratedPlan(basicRes.data.plan);
          setError(null); // Clear error since basic plan worked
        } catch (basicErr) {
          setError("Error generating basic workout plan: " + (basicErr.response?.data?.message || basicErr.message));
        }
      } else {
        setError("Error generating workout plan: " + (err.response?.data?.message || err.message));
      }
    } finally {
      setLoading(false);
    }
  };
  const handleMarkCompleted = async (index) => {
  

  // Prevent duplicate marking
  if (completedDays.includes(index)) return;

  // Get today's date in YYYY-MM-DD
  const today = new Date().toISOString().split("T")[0];

  try {
    // Save to Firestore collection
    await addDoc(collection(db, "completed_days"), {
      userId: currentUser?.uid || userId, // fallback to route param if auth context fails
      planId,
      date: today,
      dayIndex: index // optional: helps track which day was completed
    });

    // Update UI
    setCompletedDays((prev) => [...prev, index]);
  } catch (error) {
    console.error("Error saving completed day:", error);
    alert("Failed to mark this day as completed.");
  }
};


  const handleGeneratePlan = async () => {
    try {
      setLoading(true);
      setError(null);
      setShowFallback(false);
      
      // Updated to use the correct backend port (3001)
      const res = await axios.post("http://localhost:3001/api/generate-plan", {
        userId,
        planId,
      });
      setGeneratedPlan(res.data.plan);
    } catch (err) {
      console.error("Error generating workout plan:", err);
      
      // Handle specific OpenAI quota error
      if (err.response?.status === 429) {
        setError(
          <div>
            <h4>OpenAI API Quota Exceeded</h4>
            <p>Your OpenAI API key has exceeded its quota or billing limit.</p>
            <h5>Solutions:</h5>
            <ul>
              <li><strong>Check your OpenAI billing:</strong> Visit <a href="https://platform.openai.com/account/billing" target="_blank" rel="noopener noreferrer">OpenAI Billing</a></li>
              <li><strong>Add payment method:</strong> Add a credit card to your OpenAI account</li>
              <li><strong>Upgrade your plan:</strong> Consider upgrading from free tier</li>
              <li><strong>Use a different API key:</strong> Update your .env file with a new API key</li>
            </ul>
            <p><strong>Note:</strong> Free tier OpenAI accounts have limited usage. For production use, consider upgrading.</p>
            <button 
              onClick={handleGenerateBasicPlan}
              style={{
                padding: "10px 20px",
                fontSize: "16px",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                marginTop: "10px"
              }}
            >
              Generate Basic Workout Plan (No OpenAI Required)
            </button>
          </div>
        );
        setShowFallback(true);
      } else if (err.response?.data?.message?.includes("invalid response format") || 
                 err.response?.data?.message?.includes("JSON")) {
        setError(
          <div>
            <h4>OpenAI Response Format Error</h4>
            <p>The AI returned an invalid response format. This can happen occasionally with AI models.</p>
            <h5>Solutions:</h5>
            <ul>
              <li><strong>Try again:</strong> Click "Generate AI Workout Plan" again</li>
              <li><strong>Use basic plan:</strong> Click "Generate Basic Workout Plan" for immediate results</li>
              <li><strong>Check your plan details:</strong> Make sure your fitness goals are clear</li>
            </ul>
            <button 
              onClick={handleGenerateBasicPlan}
              style={{
                padding: "10px 20px",
                fontSize: "16px",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                marginTop: "10px"
              }}
            >
              Generate Basic Workout Plan (Guaranteed to Work)
            </button>
          </div>
        );
        setShowFallback(true);
      } else {
        setError("Error generating workout plan: " + (err.response?.data?.message || err.message));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateBasicPlan = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await axios.post("http://localhost:3001/api/generate-basic-plan", {
        userId,
        planId,
      });
      setGeneratedPlan(res.data.plan);
    } catch (err) {
      console.error("Error generating basic workout plan:", err);
      setError("Error generating basic workout plan: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div style={{ padding: "20px", color: "red" }}>
        <h2>Error</h2>
        <div>{error}</div>
        <p>Please check your URL parameters and try again.</p>
        <p>Current URL: /plan/{userId}/{planId}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Workout Plan Dashboard</h2>
      
      {loading && (
        <div style={{ 
          padding: "20px", 
          backgroundColor: "#f8f9fa", 
          borderRadius: "8px", 
          marginBottom: "20px",
          textAlign: "center"
        }}>
          <h3>🔄 Generating Your Workout Plan...</h3>
          <p>We're creating a personalized workout plan based on your goals and preferences.</p>
          <p><strong>Please wait...</strong></p>
        </div>
      )}

      {planDetails && (
        <div style={{ 
          backgroundColor: "#e9ecef", 
          padding: "15px", 
          borderRadius: "8px", 
          marginBottom: "20px" 
        }}>
          <h3>📋 Plan Information:</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px" }}>
            {planDetails.name && (
              <div><strong>Name:</strong> {planDetails.name}</div>
            )}
            {planDetails.goal && (
              <div><strong>Goal:</strong> {planDetails.goal}</div>
            )}
            {planDetails.frequency && (
              <div><strong>Frequency:</strong> {planDetails.frequency} days/week</div>
            )}
            {planDetails.timePeriod && (
              <div><strong>Duration:</strong> {planDetails.timePeriod}</div>
            )}
            {planDetails.fitness_level && (
              <div><strong>Fitness Level:</strong> {planDetails.fitness_level}</div>
            )}
            {planDetails.equipment && (
              <div><strong>Equipment:</strong> {planDetails.equipment}</div>
            )}
          </div>
        </div>
      )}

      {!loading && !generatedPlan && !error && (
        <div style={{ marginTop: "20px" }}>
          <p>If your workout plan doesn't generate automatically, you can generate it manually:</p>
          <button 
            onClick={handleGeneratePlan} 
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              marginRight: "10px"
            }}
          >
            Generate AI Workout Plan
          </button>

          <button 
            onClick={handleGenerateBasicPlan} 
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            Generate Basic Workout Plan
          </button>
        </div>
      )}

      {generatedPlan && (
        <div style={{ marginTop: "20px" }}>
          <h3>🎯 Your Personalized Workout Plan</h3>
          <p style={{ color: "#666", marginBottom: "20px" }}>
            Based on your goal: <strong>{planDetails?.goal}</strong> | 
            Frequency: <strong>{planDetails?.frequency} days/week</strong>
          </p>
          
          <div style={{ display: "grid", gap: "15px" }}>
            {generatedPlan.length > 0 && (
              <div style={{ marginBottom: "20px" }}>
                <h4>📈 Progress</h4>
                <div style={{
                  height: "24px",
                  width: "100%",
                  backgroundColor: "#e0e0e0",
                  borderRadius: "12px",
                  overflow: "hidden"
                }}>
                  <div style={{
                    height: "100%",
                    width: `${(completedDays.length / generatedPlan.length) * 100}%`,
                    backgroundColor: "#28a745",
                    transition: "width 0.3s ease-in-out",
                    textAlign: "center",
                    color: "white",
                    lineHeight: "24px"
                  }}>
                    {Math.round((completedDays.length / generatedPlan.length) * 100)}%
                  </div>
                </div>
              </div>
            )}

           {generatedPlan.map((day, index) => (
  <div
    key={index}
    style={{
      padding: "20px",
      border: "2px solid #e9ecef",
      borderRadius: "10px",
      backgroundColor: "#f8f9fa",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      marginBottom: "20px"
    }}
  >
    <h4
      style={{
        color: "#007bff",
        marginBottom: "15px",
        borderBottom: "2px solid #007bff",
        paddingBottom: "5px"
      }}
    >
      📅 {day.day}: {day.title}
    </h4>
    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {day.activities.map((activity, i) => (
        <li
          key={i}
          style={{
            padding: "8px 0",
            borderBottom: "1px solid #dee2e6",
            display: "flex",
            alignItems: "center"
          }}
        >
          <span
            style={{
              backgroundColor: "#28a745",
              color: "white",
              borderRadius: "50%",
              width: "20px",
              height: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px",
              marginRight: "10px"
            }}
          >
            {i + 1}
          </span>
          {activity}
        </li>
      ))}
    </ul>

    {/* Completed Button or Message */}
    {!completedDays.includes(index) ? (
      <button
        onClick={() => handleMarkCompleted(index)}
        style={{
          marginTop: "15px",
          padding: "8px 16px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer"
        }}
      >
        ✅ Mark Day as Completed
      </button>
    ) : (
      <p
        style={{
          marginTop: "15px",
          color: "#28a745",
          fontWeight: "bold"
        }}
      >
        ✔️ Completed
      </p>
    )}
  </div>
))}

          </div>
          
          <div style={{ 
            marginTop: "20px", 
            padding: "15px", 
            backgroundColor: "#d4edda", 
            borderRadius: "8px",
            border: "1px solid #c3e6cb"
          }}>
            <h4>💪 Ready to Start!</h4>
            <p>Your personalized workout plan is ready. Follow the exercises for each day to achieve your fitness goals!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanDashboard;
