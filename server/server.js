const express = require('express');
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();
const port = 5001;

app.use(express.json()); // This is for parsing incoming JSON payloads

// Allow CORS for frontend requests
app.use(cors({
  origin: 'http://localhost:3000',
}));  

// Read initial ranked data from ideas.json
const ollama_data = require(path.join(__dirname, '../ranked_ideas.json'));

// Endpoint to fetch the ranked data
app.get('/ranked-data', (req, res) => {
  res.json(ollama_data); // Send the ranked data as a JSON response
});

// Endpoint to save ideas to ideas.json (without roi and effort)
app.post('/save-ideas', (req, res) => {
  console.log('Received request body:', req.body);  // Log the incoming request

  const { ideas } = req.body;

  if (!ideas || !Array.isArray(ideas)) {
    console.error('Invalid ideas format:', ideas);  // Log invalid data format
    return res.status(400).json({ error: 'Invalid ideas data format' });
  }

  // Sanitize data by removing `roi` and `effort`
  const sanitizedIdeas = ideas.map((idea) => {
    const { roi, effort, ...sanitizedIdea } = idea;
    return sanitizedIdea; // Return the cleaned idea
  });

  // Save the cleaned ideas to the ideas.json file
  fs.writeFile(path.join(__dirname, 'ideas.json'), JSON.stringify(sanitizedIdeas, null, 2), 'utf-8', (err) => {
    if (err) {
      console.error('Error saving ideas:', err); // Log error details
      return res.status(500).json({ error: 'Error saving ideas' });
    }
    console.log("Ideas saved to ideas.json successfully");
    res.json({ message: 'Ideas saved successfully', ideas: sanitizedIdeas });
  });
});

// Start the server
app.listen(port, () => {
  console.log('Server is listening on port', port);
});
