const express = require('express')
require('dotenv').config();
//const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express()
const port = 5001
app.use(express.json()) // This is for parsing incoming JSON payloads

const ollama_data = require('../ranked_ideas.json')

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
/*const client = new MongoClient(process.env.MONGO_URI, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
}); 

async function run() {
    try {
        // Connect the client to the server
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch (error) {
        console.log('ERROR: ', error);
    }
}
    */
//run python script to call ollama and get rankings
const spawn = require("child_process").spawn;
const pythonProcess = spawn('python3',["server/ollama_fetch.py"]);

const cors = require('cors');
app.use(cors({
    origin: 'http://localhost:3000',
}));  // Enable CORS for all requests



// Work to return the json data
app.get('/ranked-data', (req, res) => {
    
    res.json(ollama_data); // Send the ranked data as a JSON response
})

//run().catch(console.dir);


app.listen(port, () => {
    console.log('Server is listening on port', port);
});
