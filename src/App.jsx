import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import UserInfo from './pages/UserInfo';
import Dashboard from './pages/Dashboard';
import Progress from './pages/Progress';
import NotFound from './pages/NotFound';

// Optional: Later, import context for auth state
// import { useAuth } from './hooks/useAuth';

function App() {
  const isLoggedIn = !!localStorage.getItem('user'); // Temporary check (replace with context later)

  return (
    <Router>
      <Routes>

        {/* Auth Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* After signup: user info page */}
        <Route path="/user-info" element={
          isLoggedIn ? <UserInfo /> : <Navigate to="/login" />
        } />

        {/* Main app page: dashboard */}
        <Route path="/dashboard" element={
          isLoggedIn ? <Dashboard /> : <Navigate to="/login" />
        } />

        {/* Progress page */}
        <Route path="/progress" element={
          isLoggedIn ? <Progress /> : <Navigate to="/login" />
        } />

        {/* Catch-all */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </Router>
  );
}

export default App;
