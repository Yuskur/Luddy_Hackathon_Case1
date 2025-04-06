import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ManageIdeas.css";

function ManageIdeas() {
  // State for storing ideas
  const [ideas, setIdeas] = useState([]);

  //loading screen
  const [isLoading, setIsLoading] = useState(false);


  // State for ROI and Effort weights (sliders)
  const [roiWeight, setRoiWeight] = useState(5);
  const [effortWeight, setEffortWeight] = useState(5);

  useEffect(() => {
    // Fetching ideas from the backend API
    fetch("http://localhost:5001/ideas-data")
      .then((response) => response.json())
      .then((data) => {
        setIdeas(data.ideas); // only set the array of ideas
        if (data.weights) {
          setRoiWeight(data.weights.roiWeight || 5);
          setEffortWeight(data.weights.effortWeight || 5);
        }
      })      
      .catch((error) => {
        console.error("Error fetching data from backend:", error);
      });
  }, []); // Empty array ensures this effect runs only once when the component mounts

  const navigate = useNavigate();

  // Function to handle input changes for ideas
  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const updatedIdeas = [...ideas];
    updatedIdeas[index][name] = value;
    setIdeas(updatedIdeas);
  };

  // Function to add a new idea slot
  const addNewIdea = () => {
    setIdeas([...ideas, { title: "", resources: "", description: "" }]);
  };

  // Function to handle deletion of an idea
  const handleDelete = (index) => {
    const updatedIdeas = ideas.filter((_, i) => i !== index); // Remove the idea at the given index
    setIdeas(updatedIdeas); // Update the state with the new list of ideas
  };

  // Function to save and rank ideas
const handleSave = () => {
  setIsLoading(true); // Show spinner

  // Filter out ideas that are missing title or description
  const cleanedIdeas = ideas.filter(
    (idea) => idea.title.trim() !== "" && idea.description.trim() !== ""
  );

  fetch("http://localhost:5001/save-ideas", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ideas: cleanedIdeas, roiWeight, effortWeight }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Ideas saved and ranked successfully:", data);
      setIdeas(data.ideas); // Optionally update state
      setIsLoading(false); // Hide spinner
      navigate("/HomePage/");
    })
    .catch((error) => {
      console.error("Error saving ideas:", error);
      setIsLoading(false); // Hide spinner on error
    });
};


  return (
    <>
      {isLoading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}
  
      <div className="manage-ideas">
        <h2>Manage Ideas</h2>
  
        {/* Sliders for global ROI and Effort weights */}
        <div className="weight-controls">
          <div className="slider-group">
            <label>ROI Weight: {roiWeight}</label>
            <input
              type="range"
              min="1"
              max="10"
              value={roiWeight}
              onChange={(e) => setRoiWeight(Number(e.target.value))}
            />
          </div>
          <div className="slider-group">
            <label>Effort Weight: {effortWeight}</label>
            <input
              type="range"
              min="1"
              max="10"
              value={effortWeight}
              onChange={(e) => setEffortWeight(Number(e.target.value))}
            />
          </div>
        </div>
  
        {/* Existing Ideas list */}
        <div className="idea-list">
          {ideas.map((idea, index) => (
            <div key={index} className="idea-card">
              <input
                type="text"
                name="title"
                value={idea.title}
                onChange={(e) => handleInputChange(e, index)}
                placeholder="Title"
              />
              <input
                type="text"
                name="resources"
                value={idea.resources}
                onChange={(e) => handleInputChange(e, index)}
                placeholder="Resources Needed"
              />
              <textarea
                name="description"
                value={idea.description}
                onChange={(e) => handleInputChange(e, index)}
                placeholder="Description"
              />
              {/* Delete button */}
              <button className="delete-button" onClick={() => handleDelete(index)}>
                Delete
              </button>
            </div>
          ))}
        </div>
  
        {/* Buttons for adding ideas and saving */}
        <button className="add-idea" onClick={addNewIdea}>
          +
        </button>
        <button className="save-rank" onClick={handleSave}>
          Save/Rank
        </button>
      </div>
    </>
  );
  }

export default ManageIdeas;
