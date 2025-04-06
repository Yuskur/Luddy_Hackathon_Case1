import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ManageIdeas.css";

function ManageIdeas() {
  // State for storing ideas
  const [ideas, setIdeas] = useState([
    { title: "", resources: "", roi: 5, effort: 5 },
  ]);

  // State for ROI and Effort weights (sliders)
  const [roiWeight, setRoiWeight] = useState(5);
  const [effortWeight, setEffortWeight] = useState(5);

  // Fetch data from the backend when the component mounts
  useEffect(() => {
    // Fetching ranked ideas from the backend API
    fetch("http://localhost:5001/ranked-data")
      .then((response) => response.json())
      .then((data) => {
        const sortedIdeas = data.sort((a, b) => a.rank - b.rank);
        setIdeas(sortedIdeas); // Store the ranked ideas in state
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
    setIdeas([...ideas, { title: "", resources: "", roi: 5, effort: 5 }]);
  };

  // Function to handle deletion of an idea
  const handleDelete = (index) => {
    const updatedIdeas = ideas.filter((_, i) => i !== index); // Remove the idea at the given index
    setIdeas(updatedIdeas); // Update the state with the new list of ideas
  };

  // Function to save and rank ideas
  const handleSave = () => {
    // Call Python script or save logic here, passing roiWeight and effortWeight as parameters
    console.log("Ideas saved and ranked with weights:", ideas, roiWeight, effortWeight);
    navigate('/HomePage/');
  };

  return (
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
  );
}

export default ManageIdeas;
