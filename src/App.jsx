import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ProfileSetup from './pages/ProfileSetup';
import HomePage from './pages/HomePage';
import AddWorkoutPlan from './pages/AddWorkoutPlan';
import PlanDashboard from './pages/PlanDashboard';
import Progress from './pages/Progress';
import NotFound from './pages/NotFound';

import ProtectedRoute from './routes/ProtectedRoute';
import './styles/global.css';

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile-setup"
          element={
            <ProtectedRoute>
              <ProfileSetup />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-plan"
          element={
            <ProtectedRoute>
              <AddWorkoutPlan />
            </ProtectedRoute>
          }
        />
        <Route
          path="/plan/:id"
          element={
            <ProtectedRoute>
              <PlanDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/progress"
          element={
            <ProtectedRoute>
              <Progress />
            </ProtectedRoute>
          }
        />

        {/* Fallback Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
