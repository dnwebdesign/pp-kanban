const mongoose = require('mongoose');

const ListSchema = new mongoose.Schema({
    title: String,
    cards: [{type: mongoose.Schema.Types.ObjectId, ref: 'card'}],
});

module.exports.listSchema = ListSchema;
module.exports.List = mongoose.model('list', ListSchema);
