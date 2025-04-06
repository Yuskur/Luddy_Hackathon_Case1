const express = require('express');
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const { spawn } = require('child_process');

const app = express();
const port = 5001;

app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000' }));

let lastRankedIdeas = null; // Live in-memory cache

// Serve raw (unranked) ideas
app.get('/ideas-data', (req, res) => {
  const ideasPath = path.join(__dirname, 'ideas.json');
  const ideas = JSON.parse(fs.readFileSync(ideasPath, 'utf-8'));
  res.json(ideas);
});

// Serve most recent ranked ideas
app.get('/ranked-data', (req, res) => {
  if (lastRankedIdeas) {
    return res.json(lastRankedIdeas);
  } else {
    return res.status(404).json({ error: 'No ranked data available yet.' });
  }
});

// Save ideas and trigger ranking
app.post('/save-ideas', (req, res) => {
  const { ideas } = req.body;

  if (!ideas || !Array.isArray(ideas)) {
    return res.status(400).json({ error: 'Invalid ideas data format' });
  }

  const sanitizedIdeas = ideas.map(({ roi, effort, ...rest }) => rest);
  const ideasPath = path.join(__dirname, 'ideas.json');

  fs.writeFile(ideasPath, JSON.stringify(sanitizedIdeas, null, 2), 'utf-8', (err) => {
    if (err) {
      console.error('Error saving ideas:', err);
      return res.status(500).json({ error: 'Error saving ideas' });
    }

    console.log('Ideas saved. Re-ranking...');

    runRankingScript((err, rankedIdeas) => {
      if (err) {
        return res.status(500).json({ error: 'Python script error', details: err });
      }
      lastRankedIdeas = rankedIdeas;
      res.json({ message: 'Ideas ranked successfully', ideas: rankedIdeas });
    });
  });
});

// Helper to run Python and get rankings
function runRankingScript(callback) {
  const pythonPath = path.join(__dirname, 'ollama_fetch.py');
  const python = spawn('python3', [pythonPath]);

  let output = '';
  let errorOutput = '';

  python.stdout.on('data', (data) => {
    output += data.toString();
  });

  python.stderr.on('data', (data) => {
    errorOutput += data.toString();
  });

  python.on('close', (code) => {
    if (code !== 0) {
      console.error('Python script failed:', errorOutput);
      return callback(errorOutput);
    }

    try {
      const rankedIdeas = JSON.parse(output);
      callback(null, rankedIdeas);
    } catch (parseErr) {
      console.error('Error parsing Python output:', parseErr);
      callback(parseErr.message);
    }
  });
}

// On server start, run ranking once
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
  console.log('Initializing ranking from Python...');

  runRankingScript((err, rankedIdeas) => {
    if (err) {
      console.error('Initial ranking failed:', err);
    } else {
      lastRankedIdeas = rankedIdeas;
      console.log('Initial ranking complete.');
    }
  });
});
