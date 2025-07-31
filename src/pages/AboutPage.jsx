import React from "react";
import "../styles/AboutPage.css";

const AboutPage = () => {
  return (
    <div className="about-container">
      <div className="about-content">
        <h1>About FitLog AI</h1>
        <p>
          UniFit is an intelligent fitness workout tracker designed to help
          users plan, log, and review their workouts seamlessly. With AI-powered
          insights and a clean interface, users can optimize their training and
          stay consistent.
        </p>
        <h2>Key Features</h2>
        <ul>
          <li>AI-logged workouts</li>
          <li>Custom workout plans</li>
          <li>Filter by date, type, and exercise</li>
          <li>Calendar view with highlights</li>
        </ul>
        <p className="footer-note">
          Crafted with ❤️ .
        </p>
      </div>
    </div>
  );
};

export default AboutPage;