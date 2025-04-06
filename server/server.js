const express = require('express');
require('dotenv').config(); // load environment variables from a .env file
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const { spawn } = require('child_process');

const app = express();
const port = 5001;

app.use(express.json()); // middleware to parse JSON payloads
app.use(cors({ origin: 'http://localhost:3000' })); // allow server.js to get data from the frontend

let lastRankedIdeas = null; // live in-memory cache to store the most recent ranked ideas

// serve unranked ideas + weights
app.get('/ideas-data', (req, res) => { // endpoint for fetching ideas from ideas.json
  const ideasPath = path.join(__dirname, 'ideas.json');
  const ideas = JSON.parse(fs.readFileSync(ideasPath, 'utf-8'));
  res.json(ideas); // send the unranked ideas as JSON response
});

// serve most recent ranked ideas
app.get('/ranked-data', (req, res) => { // endpoint for fetching ranked ideas
  if (lastRankedIdeas) {
    return res.json(lastRankedIdeas); // return ranked ideas if available
  } else {
    return res.status(404).json({ error: 'No ranked data available yet.' }); // return an error if no ranked ideas
  }
});

// save ideas and trigger ranking
app.post('/save-ideas', (req, res) => { // endpoint for saving ideas and triggering ranking
  const { ideas, roiWeight, effortWeight } = req.body; // get ideas and weights from request body

  if (!ideas || !Array.isArray(ideas)) {
    return res.status(400).json({ error: 'Invalid ideas data format' }); // return error if ideas data format is invalid
  }

  const sanitizedIdeas = ideas.map(({ roi, effort, ...rest }) => rest); // sanitize ideas by removing roi and effort values
  const ideasPath = path.join(__dirname, 'ideas.json');

  // save ideas along with weights
  const payload = {
    weights: {
      roiWeight,
      effortWeight
    },
    ideas: sanitizedIdeas
  };

  // write into the ideas.json file and run the ranking script to rank the ideas
  fs.writeFile(ideasPath, JSON.stringify(payload, null, 2), 'utf-8', (err) => {
    if (err) {
      console.error('Error saving ideas:', err); // log error if writing fails
      return res.status(500).json({ error: 'Error saving ideas' }); // send error response
    }

    console.log('Ideas and weights saved. Re-ranking...');

    // run ranking script after saving ideas
    runRankingScript((err, rankedIdeas) => {
      if (err) {
        return res.status(500).json({ error: 'Python script error', details: err }); // send error response if Python script fails
      }
      lastRankedIdeas = rankedIdeas; // update the in-memory cache with ranked ideas
      res.json({ message: 'Ideas ranked successfully', ideas: rankedIdeas }); // send ranked ideas as response
    });
  });
});

// helper function to run Python script and get rankings
function runRankingScript(callback) {
  const pythonPath = path.join(__dirname, 'ollama_fetch.py');
  const python = spawn('python3', [pythonPath]); // spawn a child process to run the Python script

  let output = '';
  let errorOutput = '';

  python.stdout.on('data', (data) => {
    output += data.toString(); // capture the output of the Python script
    console.log(data.toString()); // log the output
  });

  python.stderr.on('data', (data) => {
    errorOutput += data.toString(); // capture any errors from the Python script
  });

  python.on('close', (code) => {
    if (code !== 0) { // check if the Python script ran successfully
      console.error('Python script failed:', errorOutput); // log any errors
      return callback(errorOutput); // pass the error to the callback
    }

    try {
      const rankedIdeas = JSON.parse(output); // parse the JSON output from the Python script
      callback(null, rankedIdeas); // pass the ranked ideas to the callback
    } catch (parseErr) {
      console.error('Error parsing Python output:', parseErr); // log error if JSON parsing fails
      callback(parseErr.message); // pass the error message to the callback
    }
  });
}

// on server start, run the ranking once to initialize the ranked data
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
  console.log('Initializing ranking from Python...');

  // run ranking script on server start
  runRankingScript((err, rankedIdeas) => {
    if (err) {
      console.error('Initial ranking failed:', err); // log error if initial ranking fails
    } else {
      lastRankedIdeas = rankedIdeas; // store the initial ranked ideas in memory
      console.log('Initial ranking complete.');
    }
  });
});
