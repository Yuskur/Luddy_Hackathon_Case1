import React from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

function HomePage() {
  // Mock data for ideas
  const ideas = [
    {
      id: 1,
      idea: "We should buy new machinery for factory 6.",
      userName: "Alice",
      roi: 8,
      effort: 6,
    },
    {
      id: 2,
      idea: "Launch a new marketing campaign for product X.",
      userName: "Bob",
      roi: 7,
      effort: 4,
    },
    {
      id: 3,
      idea: "Upgrade the software for customer support.",
      userName: "Charlie",
      roi: 9,
      effort: 5,
    },
  ];

  const navigate = useNavigate();

  return (
    <div className="homepage">
      <h1>Idea Rankings</h1>
      <div className="idea-list">
        {ideas.map((idea) => (
          <div key={idea.id} className="idea-card">
            <div className="idea-header">
              <span className="user-name">{idea.userName}</span>
              <span className="roi-effort">
                ROI: {idea.roi}/10 | Effort: {idea.effort}/10
              </span>
            </div>
            <p className="idea-description">{idea.idea}</p>
            <button
              className="more-info-button"
              onClick={() => navigate(`/more-info/${idea.id}`)}
            >
              More Info
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;