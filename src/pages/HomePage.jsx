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
    <div style={{ 
      width: '100vw', 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      backgroundColor: '#fff',
      padding: 0,
      margin: 0
    }}>
      {/* Header Row: Logo + Navbar */}
      <div style={{ 
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '4px 48px 8px 48px',
        backgroundColor: '#fff',
        position: 'relative',
        zIndex: 1000,
        minHeight: '60px',
        border: '2px solid red'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'yellow' }}>
          <img 
            src={logoImage} 
            alt="Logo" 
            style={{ width: '100px', height: 'auto', display: 'block' }} 
          />
          <span style={{ marginLeft: '10px', fontSize: '18px', color: '#333' }}>UniFit</span>
        </div>
        <div style={{ 
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(90deg, rgba(181, 227, 114, 0.84), rgba(56, 82, 17, 0.74))',
          borderRadius: '39px',
          boxShadow: '0 4px 4px rgba(0, 0, 0, 0.73)',
          minWidth: '500px',
          maxWidth: '700px',
          height: '48px',
          padding: '0 32px',
          margin: 0
        }}>
          <div style={{ display: 'flex', gap: '32px' }}>
            <div style={{ fontSize: '20px', color: '#ffffff', cursor: 'pointer', padding: '0 8px' }} onClick={() => navigate('/')}>Home</div>
            <div style={{ fontSize: '20px', color: '#ffffff', cursor: 'pointer', padding: '0 8px' }} onClick={() => navigate('/about')}>About</div>
            <div style={{ fontSize: '20px', color: '#ffffff', cursor: 'pointer', padding: '0 8px' }} onClick={() => navigate('/profile')}>Profile</div>
          </div>
          <div style={{ 
            background: '#273c07',
            borderRadius: '39px',
            padding: '0.3rem 1.2rem',
            marginLeft: '16px'
          }}>
            <div style={{ 
              color: 'white',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }} onClick={async () => {
              await supabase.auth.signOut();
              navigate('/login');
            }}>
              Sign Out
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div style={{ 
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginTop: '8px',
        marginBottom: '24px'
      }}>
        <div style={{ 
          width: '90vw',
          maxWidth: '1200px',
          height: '55vh',
          minHeight: '350px',
          maxHeight: '550px',
          borderRadius: '39px',
          overflow: 'hidden',
          position: 'relative',
          background: '#eaf5e1',
          display: 'flex',
          alignItems: 'stretch',
          boxShadow: '0 4px 4px rgba(0,0,0,0.15)'
        }}>
          <img 
            src={heroImage} 
            alt="Hero" 
            style={{ 
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '39px',
              display: 'block'
            }} 
          />
          <div style={{ 
            position: 'absolute',
            top: '48px',
            left: '48px',
            fontSize: '42px',
            color: '#ffffff',
            fontStyle: 'italic',
            fontWeight: 300,
            zIndex: 2,
            textShadow: '1px 2px 8px rgba(0,0,0,0.3)',
            lineHeight: 1.2,
            maxWidth: '350px'
          }}>
            Personalized<br />
            fitness<br />
            for<br />
            <span style={{ fontWeight: 500, fontStyle: 'italic' }}>Everybody.</span>
          </div>
        </div>
      </div>

      {/* Plan Cards Section */}
      <div style={{ 
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginTop: '24px',
        marginBottom: '48px'
      }}>
        <div style={{ 
          width: '90vw',
          maxWidth: '1200px',
          background: 'rgba(223, 239, 199, 0.35)',
          borderRadius: '39px',
          boxShadow: '0 4px 4px rgba(73, 78, 66, 0.16)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '40px',
          padding: '32px',
          position: 'relative',
          minHeight: '200px'
        }}>
          {loading ? (
            <div style={{ 
              width: '400px',
              height: '160px',
              background: 'rgba(151, 203, 78, 0.59)',
              boxShadow: '0 4px 4px rgba(73, 78, 66, 0.16)',
              borderRadius: '39px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              color: '#fff',
              fontWeight: 'bold',
              margin: 0
            }}>Loading...</div>
          ) : plans.length === 0 ? (
            <div style={{ 
              width: '400px',
              height: '160px',
              background: 'rgba(151, 203, 78, 0.59)',
              boxShadow: '0 4px 4px rgba(73, 78, 66, 0.16)',
              borderRadius: '39px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              color: '#fff',
              fontWeight: 'bold',
              margin: 0
            }}>No Plans</div>
          ) : (
            plans.map((plan) => (
              <div 
                key={plan.id} 
                style={{ 
                  width: '400px',
                  height: '160px',
                  background: 'rgba(151, 203, 78, 0.59)',
                  boxShadow: '0 4px 4px rgba(73, 78, 66, 0.16)',
                  borderRadius: '39px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  color: '#fff',
                  fontWeight: 'bold',
                  margin: 0,
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease'
                }}
                onClick={() => navigate(`/plan/${plan.id}`)}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.02)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                }}
              >
                <PlanCard plan={plan} />
              </div>
            ))
          )}
          <div style={{ 
            width: '90px',
            height: '90px',
            background: '#8ac34d',
            borderRadius: '50%',
            color: 'white',
            fontSize: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(73, 78, 66, 0.18)',
            border: '4px solid #fff'
          }} onClick={() => navigate('/')}>+</div>
        </div>
      </div>
    </div>
  );
}