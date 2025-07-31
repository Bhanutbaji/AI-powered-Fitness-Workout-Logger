import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import "../styles/AddWorkoutPlan.css";
import UnifitLogo from "../assets/UnifitLogo.png";

const goalOptions = [
  { value: "reduce-belly-fat", label: "Reduce Belly Fat" },
  { value: "weight-loss", label: "Weight Loss" },
  { value: "weight-gain", label: "Weight Gain" },
  { value: "muscle-strength", label: "Muscle Strength" },
  { value: "endurance", label: "Endurance" },
  { value: "general-fitness", label: "General Fitness" },
];

const AddWorkoutPlan = () => {
  const [form, setForm] = useState({
    name: "",
    frequency: "",
    goal: "",
    type: "",
    timePeriodValue: "",
    timePeriodUnit: "days",
    goalWeight: "",
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    try {
      const user = auth.currentUser;
      if (!user) {
        setStatus("Please log in to add a workout plan");
        setTimeout(() => navigate("/login"), 2000);
        return;
      }

      const parsedFrequency = parseInt(form.frequency, 10);
      if (isNaN(parsedFrequency)) {
        setStatus("Please select a valid frequency.");
        setLoading(false);
        return;
      }

      const planData = {
        name: form.name,
        frequency: parsedFrequency,
        goal: form.goal,
        type: form.type,
        timePeriod: `${form.timePeriodValue} ${form.timePeriodUnit}`,
        userId: user.uid,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      if (form.goal === "weight-loss" || form.goal === "weight-gain") {
        planData.goalWeight = form.goalWeight;
      }

      await addDoc(collection(db, "workout_plans"), planData);

      setStatus("Saved successfully!");
      setTimeout(() => {
        navigate("/home");
      }, 1500);
    } catch (error) {
      setStatus("Failed to save workout plan: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-plan-page">
      <header className="add-plan-header">
        <div className="add-plan-logo">
          <img src={UnifitLogo} alt="Unifit Logo" className="add-plan-logo-img" />
        </div>
      </header>

      <div className="add-plan-container">
        <form onSubmit={handleSubmit} className="add-plan-form">
          <h2 className="add-plan-title">Add Workout Plan</h2>

          <input
            type="text"
            name="name"
            placeholder="Plan Name"
            value={form.name}
            onChange={handleChange}
            required
            disabled={loading}
            className="add-plan-input"
          />

          <div className="add-plan-row">
            <input
              type="number"
              name="timePeriodValue"
              placeholder="Time Period"
              min="1"
              value={form.timePeriodValue}
              onChange={handleChange}
              required
              disabled={loading}
              className="add-plan-input add-plan-timeperiod"
            />
            <select
              name="timePeriodUnit"
              value={form.timePeriodUnit}
              onChange={handleChange}
              required
              disabled={loading}
              className="add-plan-select add-plan-timeunit"
            >
              <option value="days">Days</option>
              <option value="months">Months</option>
              <option value="years">Years</option>
            </select>
          </div>

          <select
            name="frequency"
            value={form.frequency}
            onChange={handleChange}
            required
            disabled={loading}
            className="add-plan-select"
          >
            <option value="">Select Frequency</option>
            <option value="3">3 Days / week</option>
            <option value="5">5 Days / week</option>
            <option value="7">Daily</option>
          </select>

          <select
            name="goal"
            value={form.goal}
            onChange={handleChange}
            required
            disabled={loading}
            className="add-plan-select"
          >
            <option value="">Select Goal</option>
            {goalOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          {(form.goal === "weight-loss" || form.goal === "weight-gain") && (
            <input
              type="number"
              name="goalWeight"
              placeholder="Goal Weight (kg)"
              min="1"
              value={form.goalWeight}
              onChange={handleChange}
              required
              disabled={loading}
              className="add-plan-input"
            />
          )}

          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            required
            disabled={loading}
            className="add-plan-select"
          >
            <option value="">Exercise Type</option>
            <option value="cardio">Cardio</option>
            <option value="strength">Strength</option>
            <option value="full-body">Full Body</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="add-plan-btn add-plan-btn-green"
          >
            {loading ? "Saving..." : "Save Plan"}
          </button>

          {status && (
            <div className={`add-plan-status ${status.includes("successfully") ? "add-plan-status-success" : "add-plan-status-error"}`}>
              {status}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddWorkoutPlan;
