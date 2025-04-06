import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import './AddIdea.css';

function AddIdea(props) {
    const [title, setTitle] = useState("");
    const [roi, setRoi] = useState("");
    const [effort, setEffort] = useState("");
    const [description, setDescription] = useState("");

    const nav = useNavigate();

    const handleAddIdea = async (event) => {
        event.preventDefault();

        if (title && description) {
            try {
                const response = await fetch('http://localhost:5001/add-idea', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ title, roi, effort, description }),
                });

                if (response.ok) {
                    alert("Idea added successfully!");
                    nav('/home');  // Redirect to another page after adding idea
                } else {
                    alert("Failed to add idea.");
                }
            } catch (error) {
                console.log("ERROR", error);
            }
        } else {
            console.log("Fill in all fields");
        }
    };

    return props.trigger ? (
        <div className="popup-body">
            <div className="popup-inner">
                <button className="close-button" onClick={() => props.setTrigger(false)}>
                    x
                </button>
                <h2 className="popup-title">Add New Idea</h2>
                <form onSubmit={handleAddIdea}>
                    <div className="form-group">
                        <input
                            type="text"
                            placeholder="Idea Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <textarea
                            placeholder="Idea Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="submit-button">Add Idea</button>
                </form>
            </div>
        </div>
    ) : null;
}

export default AddIdea;
