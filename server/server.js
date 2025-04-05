import express from 'express'

const app = express()
const port = 5000
app.use(express.json()) // This is for parsing incoming json payloads




app.listen(port, () => {
    console.log('listening')
})
