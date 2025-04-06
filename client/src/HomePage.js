import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

function HomePage() {
  const [ideas, setIdeas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5001/ranked-data")
      .then((response) => response.json())
      .then((data) => {
        const sortedIdeas = data.sort((a, b) => a.rank - b.rank);
        setIdeas(sortedIdeas);
      })
      .catch((error) => {
        console.error("Error fetching data from backend:", error);
      });
  }, []);

  function Idea({ idea }) {
    const [expanded, setExpanded] = useState(false);

    return (
      <div key={idea.id} className="idea-card">
        <div className="idea-header">
          <span className="user-name">{"Rank: " + idea.rank}</span>
          <span className="roi-effort">
            ROI: {idea.roi}/10 | Effort: {idea.effort}/10
          </span>
        </div>
        <p className="idea-description">{idea.title}</p>
        <p>{idea.description}</p>

        <button
          className="more-info-button"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "Hide Details" : "Show Details"}
        </button>

        <div className={`idea-details-container ${expanded ? "expanded" : ""}`}>
          <div className="idea-details">
            <p><strong>ROI Reason:</strong> {idea.roi_reason}</p>
            <p><strong>Effort Reason:</strong> {idea.effort_reason}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="homepage">
      <h1>Idea Rankings</h1>

      {/* Top 3 Section */}
      <h2>Top 3 Ideas</h2>
      <div className="idea-list top-three-list">
        {ideas.slice(0, 3).map((idea) => (
          <Idea key={idea.rank} idea={idea} />
        ))}
      </div>

      {/* Other Ideas */}
      <h2>Other Ideas</h2>
      <div className="idea-list">
        {ideas.slice(3).map((idea) => (
          <Idea key={idea.rank} idea={idea} />
        ))}
      </div>
    </div>
  );
}

export default HomePage;
