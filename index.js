const express = require('express')
const cors = require('cors')
const bodyparser = require('body-parser')
require('dotenv').config()

// main app
const app = express()

// apply middleware
app.use(cors())
app.use(bodyparser.json())
const db = require('./database')
db.connect((err) => {
    if(err) return console.log('error connecting' + err)
    console.log('success')
})

// main route
const response = (req, res) => res.status(200).send('<h1>REST API JCWM1504</h1>')
app.get('/', response)


const { userRouter, movRouter } = require('./router')
app.use('/user', userRouter)
app.use('/movies', movRouter)

// bind to local machine
const PORT = 2000
app.listen(PORT, () => `CONNECTED : port ${PORT}`)