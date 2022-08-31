const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
    content: String,
    done: {type: Boolean, default: false},
    todoList: mongoose.Schema.Types.ObjectId
});

module.exports.todoSchema = TodoSchema;
module.exports.Todo = mongoose.model('todo', TodoSchema);
