import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

function HomePage() {
  // State to store ranked ideas from backend
  const [ideas, setIdeas] = useState([]);
  const navigate = useNavigate();

  // Fetch data from the backend when the component mounts
  useEffect(() => {
    // Fetching ranked ideas from the backend API
    fetch("http://localhost:5001/ranked-data")
      .then((response) => response.json())
      .then((data) => {
        setIdeas(data); // Store the ranked ideas in state
      })
      .catch((error) => {
        console.error("Error fetching data from backend:", error);
      });
  }, []); // Empty array ensures this effect runs only once when the component mounts

  function Idea({idea}){
    return(
      <div key={idea.id} className="idea-card">
            <div className="idea-header">
              <span className="user-name">{idea.rank}</span>
              <span className="roi-effort">
                ROI: {idea.roi}/10 | Effort: {idea.effort}/10
              </span>
            </div>
            <p className="idea-description">{idea.title}</p>
            <button
              className="more-info-button"
              onClick={() => navigate(`/more-info/`)}
            >
              More Info
            </button>
        </div>
    )
  }


  return (
    <div className="homepage">
      <h1>Idea Rankings</h1>
      <div className="idea-list">
        {ideas.sort((a,b) => a.rank - b.rank)
        .map((idea) => (
          <Idea key={idea.rank} idea={idea}/>
        ))}
      </div>
      <div className="add-idea">
        <button className="add-idea-button" onClick={() => navigate('/add-idea')}>
          +
        </button>
      </div>
    </div>
  );
}

export default HomePage;