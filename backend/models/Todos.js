const mongoose = require('mongoose');

const TodosSchema = new mongoose.Schema({
    content: String,
    done: { type: Boolean, default: false }
});

module.exports.todosSchema = TodosSchema;
module.exports.Todo = mongoose.model('todo', TodosSchema);
