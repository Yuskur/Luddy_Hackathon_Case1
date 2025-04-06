import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

function HomePage() {
<<<<<<< HEAD
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

  //api call

  


=======
  // State to store ranked ideas from backend
  const [ideas, setIdeas] = useState([]);
>>>>>>> 3143ad6 (add logic to run python script and add cors)
  const navigate = useNavigate();

  // Fetch data from the backend when the component mounts
  useEffect(() => {
    // Fetching ranked ideas from the backend API
    fetch("http://localhost:3000/ranked-data")
      .then((response) => response.json())
      .then((data) => {
        setIdeas(data); // Store the ranked ideas in state
      })
      .catch((error) => {
        console.error("Error fetching data from backend:", error);
      });
  }, []); // Empty array ensures this effect runs only once when the component mounts


  return (
    <div className="homepage">
      <h1>Idea Rankings</h1>
      <div className="idea-list">
        {ideas.map((idea) => (
          <div key={idea.id} className="idea-card">
            <div className="idea-header">
              <span className="user-name">{idea.rank}</span>
              <span className="roi-effort">
                ROI: {idea.roi}/10 | Effort: {idea.effort}/10
              </span>
            </div>
            <p className="idea-description">{idea.idea}</p>
            <button
              className="more-info-button"
              onClick={() => navigate(`/more-info/`)}
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