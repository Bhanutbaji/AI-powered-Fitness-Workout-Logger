import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import '../styles/ProfileSetup.css';

const ProfileSetupPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    medical_conditions: 'none',
  });

  const [userId, setUserId] = useState(null);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        navigate('/'); // redirect to login if not authenticated
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');

    try {
      // Save user profile data to Firestore
      await setDoc(doc(db, 'users', userId), {
        ...formData,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      setStatus('Saved successfully!');
      
      // Navigate to homepage after showing success message
      setTimeout(() => {
        navigate('/home');
      }, 1500);
      
    } catch (error) {
      setStatus('Failed to save profile.');
      console.error('Error saving profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <header className="profile-header">UNIFIT</header>
      <main className="profile-main">
        <div className="profile-box">
          <h2>Profile Setup</h2>
          <form onSubmit={handleSave}>
            <label>Name</label>
            <input 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              required 
              disabled={loading}
            />

            <label>Age</label>
            <input 
              type="number" 
              name="age" 
              value={formData.age} 
              onChange={handleChange} 
              required 
              disabled={loading}
            />

            <label>Gender</label>
            <select 
              name="gender" 
              value={formData.gender} 
              onChange={handleChange} 
              required
              disabled={loading}
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>

            <label>Height (cm)</label>
            <input 
              type="number" 
              name="height" 
              value={formData.height} 
              onChange={handleChange} 
              required 
              disabled={loading}
            />

            <label>Weight (kg)</label>
            <input 
              type="number" 
              name="weight" 
              value={formData.weight} 
              onChange={handleChange} 
              required 
              disabled={loading}
            />

            <label>Medical Conditions</label>
            <select 
              name="medical_conditions" 
              value={formData.medical_conditions} 
              onChange={handleChange}
              disabled={loading}
            >
              <option value="none">None</option>
              <option value="Diabetes">Diabetes</option>
              <option value="Cholestrol">Cholestrol</option>
              <option value="Hypertension">Hypertension</option>
              <option value="PCOS">PCOS</option>
              <option value="Thyroid">Thyroid</option>
              <option value="Physical Injury">Physical Injury</option>
              <option value="Excessive stress/anxiety">Excessive stress/anxiety</option>
            </select>

            <button 
              type="submit" 
              className="save-button"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>

            {status && (
              <div 
                style={{ 
                  marginTop: '15px', 
                  padding: '10px',
                  borderRadius: '5px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  backgroundColor: status.includes('successfully') ? '#d4edda' : '#f8d7da',
                  color: status.includes('successfully') ? '#155724' : '#721c24',
                  border: status.includes('successfully') ? '1px solid #c3e6cb' : '1px solid #f5c6cb'
                }}
              >
                {status}
              </div>
            )}
          </form>
        </div>
      </main>
    </div>
  );
};

export default ProfileSetupPage;
