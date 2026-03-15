require('dotenv').config()

const express = require('express')

const app = express()

const PORT = process.env.PORT || 3000

app.use(express.json())

app.use('/health', (req, res) => {
    res.writeHead(200, { 'x-content-type': 'text/plain' })
    res.end("Healthy")
})

app.listen(PORT, () => {
    console.log(`[Server] Server listening on port ${PORT}`)
})
