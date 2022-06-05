const mongoose = require('mongoose')
const ListsSchema = new mongoose.Schema({
    id: Number,
    title: String,
    tasks: Array,
})
module.exports = mongoose.model('list', ListsSchema)
