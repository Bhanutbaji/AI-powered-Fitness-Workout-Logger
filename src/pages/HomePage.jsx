import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs, query, where,deleteDoc, doc } from 'firebase/firestore';
import { useAuth } from '../hooks/useAuth';
import '../styles/HomePage.css';
import heroImage from '../assets/images/hero.png';
import logoImage from '../assets/images/logo.png';
import PlanCard from '../components/PlanCard';



export default function HomePage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  

  useEffect(() => {
    const fetchPlans = async () => {
      setLoading(true);
      try {
        const plansRef = collection(db, 'workout_plans');
        const q = query(plansRef, where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const plansData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPlans(plansData);
      } catch (error) {
        console.error('Error fetching plans:', error.message);
      }
      setLoading(false);
    };
    if (user) {
      fetchPlans();
    }
  }, [user]);
  const handleDelete = async (planId) => {
  try {
    await deleteDoc(doc(db, 'workout_plans', planId));
    setPlans(plans.filter(plan => plan.id !== planId));
  } catch (error) {
    console.error('Error deleting plan:', error.message);
  }
};

  return (
    <div className="homepage-container">
      {/* Header Row: Logo + Navbar */}
      <div className="header-row">
        <img src={logoImage} alt="Logo" className="logo" />
        <div className="navbar">
          <div className="nav-links">
            <div className="nav-item" onClick={() => navigate('/home')}>Home</div>
            <div className="nav-item" onClick={() => navigate('/about')}>About</div>
            <div className="nav-item" onClick={() => navigate('/profile')}>Profile</div>
          </div>
          <div className="signout-box">
            <div className="signout-text" onClick={async () => {
              await logout();
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
                <PlanCard plan={plan} onDelete={handleDelete} />
              </div>
            ))
          )}
          <div className="add-btn" onClick={() => navigate('/add-workout-plan')}>+</div>
        </div>
      </div>
    </div>
  );
}