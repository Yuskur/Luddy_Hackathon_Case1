import express from 'express'
import dotenv from 'dotenv'
import { MongoClient, ServerApiVersion } from 'mongodb'

dotenv.config()

const app = express()
const port = 5001
app.use(express.json()) // This is for parsing incoming json payloads



app.listen(port, () => {
    console.log('listening')
})
