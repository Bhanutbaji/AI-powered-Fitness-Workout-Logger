import './App.css';

// Import your pages
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ProfileSetupPage from "./pages/ProfileSetupPage";
import AddWorkoutPlan from "./pages/AddWorkoutPLan";
import HomePage from "./pages/HomePage";

import PlanDashboard from './pages/PlanDashboard';
import TestPage from './pages/TestPage';


function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile-setup" element={<ProfileSetupPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/add-workout-plan" element={<AddWorkoutPlan />} />
        
        
      
        <Route path="/test" element={<TestPage />} />
        <Route path="/plan/:userId/:planId" element={<PlanDashboard />} />

        <Route path="/plan-dashboard" element={<HomePage />} />
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
