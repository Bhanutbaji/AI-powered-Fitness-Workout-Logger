import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { db } from '../supabaseClient'; // If you're using Firebase instead, use your firebase.js file
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import '../styles/PlanDashboard.css';

const PlanDashboard = () => {
  const navigate = useNavigate();
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [progress, setProgress] = useState([]);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
          console.log('User not logged in');
          return;
        }

        const userDocRef = doc(db, 'users', user.uid); // assumes 'users' collection
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          const plan = userData.workoutPlan;

          setWorkoutPlan(plan);
          setProgress(new Array(plan.plan.length).fill(false)); // initialize progress
        } else {
          console.log('No plan found');
        }
      } catch (err) {
        console.error('Error fetching plan:', err);
      }
    };

    fetchPlan();
  }, []);

  const markCompleted = (index) => {
    const updatedProgress = [...progress];
    updatedProgress[index] = true;
    setProgress(updatedProgress);
  };

  if (!workoutPlan) {
    return <div>Loading workout plan...</div>;
  }

  const completedDays = progress.filter(Boolean).length;
  const percentage = (completedDays / workoutPlan.plan.length) * 100;

  const weeklyData = workoutPlan.plan.map((_, idx) => ({
    day: `Day ${idx + 1}`,
    workouts: progress[idx] ? 1 : 0,
  }));

  return (
    <div className="dashboard-container">
      <div className="left-side">
        <h2>{workoutPlan.goal}</h2>
        <p><strong>Frequency:</strong> {workoutPlan.frequency}</p>
        <div className="plan-list">
          {workoutPlan.plan.map((item, index) => (
            <div key={index} className={`plan-day ${progress[index] ? 'completed' : ''}`}>
              <p>{item}</p>
              <button
                onClick={() => markCompleted(index)}
                disabled={progress[index]}
              >
                {progress[index] ? 'Completed' : 'Mark as Completed'}
              </button>
            </div>
          ))}
        </div>
        <div className="bottom-actions">
          <button className="edit-btn">Edit Plan</button>
          <button className="delete-btn" onClick={() => navigate('/')}>Delete Plan</button>
        </div>
      </div>

      <div className="right-side">
        <h3>Your Progress</h3>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${percentage}%` }} />
        </div>
        <p>{completedDays} / {workoutPlan.plan.length} Days Completed</p>

        <h4>Weekly Workout Frequency</h4>
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="workouts" fill="#007bff" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default PlanDashboard;
