import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { useAuth } from '../hooks/useAuth';
import '../styles/HomePage.css';
import heroImage from '../assets/images/hero.png';
import logoImage from '../assets/images/logo.png';
import PlanCard from '../components/PlanCard';

export default function HomePage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlans = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('workout_plans')
        .select('*')
        .eq('user_id', user.id);
      if (error) {
        console.error('Error fetching plans:', error.message);
      } else {
        setPlans(data);
      }
      setLoading(false);
    };
    if (user) {
      fetchPlans();
    }
  }, [user]);

  return (
    <div className="homepage-container">
      {/* Header Row: Logo + Navbar */}
      <div className="header-row">
        <img src={logoImage} alt="Logo" className="logo" />
        <div className="navbar">
          <div className="nav-links">
            <div className="nav-item" onClick={() => navigate('/')}>Home</div>
            <div className="nav-item" onClick={() => navigate('/about')}>About</div>
            <div className="nav-item" onClick={() => navigate('/profile')}>Profile</div>
          </div>
          <div className="signout-box">
            <div className="signout-text" onClick={async () => {
              await supabase.auth.signOut();
              navigate('/login');
            }}>
              Sign Out
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="hero-section-wrapper">
        <div className="hero">
          <img src={heroImage} alt="Hero" className="hero-image" />
          <div className="hero-text">
            Personalized<br />
            fitness<br />
            for<br />
            <span style={{ fontWeight: 500, fontStyle: 'italic' }}>Everybody.</span>
          </div>
        </div>
      </div>

      {/* Plan Cards Section */}
      <div className="plan-cards-section">
        <div className="plan-cards-scroll">
          {loading ? (
            <div className="card">Loading...</div>
          ) : plans.length === 0 ? (
            <div className="card">No Plans</div>
          ) : (
            plans.map((plan) => (
              <div key={plan.id} className="card">
                <PlanCard plan={plan} />
              </div>
            ))
          )}
          <div className="add-btn" onClick={() => navigate('/add')}>+</div>
        </div>
      </div>
    </div>
  );
}