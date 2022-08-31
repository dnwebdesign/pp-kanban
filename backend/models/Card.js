const mongoose = require('mongoose');

const CardSchema = new mongoose.Schema({
    title: String,
    description: String,
    todoLists: [{type: mongoose.Schema.Types.ObjectId, ref: 'todolist'}],
    list: mongoose.Schema.Types.ObjectId
});

module.exports.cardSchema = CardSchema;
module.exports.Card = mongoose.model('card', CardSchema);
