import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/HomePage.css';

export default function PlanCard({ plan, onDelete }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/plan/${plan.userId}/${plan.id}`);
  };

  const handleDelete = (e) => {
    e.stopPropagation(); // Prevent triggering navigation
    if (window.confirm("Are you sure you want to delete this plan?")) {
      onDelete(plan.id);
    }
  };

  const isExpired = () => {
    if (!plan.planEndDate) return false;
    const endDate = plan.planEndDate.toDate ? plan.planEndDate.toDate() : new Date(plan.planEndDate);
    return new Date() > endDate;
  };

  return (
    <div className={`plan-card ${isExpired() ? 'expired' : ''}`} onClick={handleClick} style={{ cursor: 'pointer', position: 'relative' }}>
      <h3 className="plan-card-title">{plan.name || 'Workout Plan'}</h3>
      <p className="plan-card-detail"><strong>Duration:</strong> {plan.timePeriod || 'N/A'}</p>
      <p className="plan-card-detail"><strong>Goal:</strong> {plan.goal || 'N/A'}</p>
      {plan.currentWeek && (
        <p className="plan-card-detail"><strong>Week:</strong> {plan.currentWeek}</p>
      )}
      {isExpired() && (
        <p className="plan-card-detail expired-text">⚠️ Expired</p>
      )}
      
      {/* Delete button */}
      <button className="delete-button" onClick={handleDelete}>
        🗑️
      </button>
    </div>
  );
}
