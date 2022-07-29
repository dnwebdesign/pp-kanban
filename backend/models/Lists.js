const mongoose = require('mongoose');

const ListsSchema = new mongoose.Schema({
    title: String,
    tasks: [{type: mongoose.Schema.Types.ObjectId, ref: 'tasks'}],
});

module.exports.listsSchema = ListsSchema;
module.exports.List = mongoose.model('list', ListsSchema);
