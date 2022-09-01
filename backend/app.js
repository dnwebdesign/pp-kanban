const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const cors = require("cors")
const dotenv = require('dotenv')
// create our express app
const app = express()

dotenv.config()

// database
const uri = process.env.mongodb_uri;
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('MongoDB Connected…')
    })
    .catch(err => console.log(err))

// middleware
app.use(cors())
app.use(bodyParser.json())

// routes
app.get("/", (req, res) => {
    res.send("Server running.")
})

const ListsRoute = require('./routes/Lists')
app.use('/lists', ListsRoute)

//start server
app.listen(3000, () => {
    console.log("listening at port:3000")
})
