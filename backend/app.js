const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const cors = require("cors")
// create our express app
const app = express()

// database

const uri = "mongodb+srv://pp-kanban-db:a%5E%40VJCG7kM%24I!79FBRg2%24N%40be*pp@cluster0.mllen.mongodb.net/pp-kanban";
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
