const mongoose = require('mongoose');

const TodoListSchema = new mongoose.Schema({
    title: String,
    todos: [{type: mongoose.Schema.Types.ObjectId, ref: 'todos'}],
    task: mongoose.Schema.Types.ObjectId
});

module.exports.todoListSchema = TodoListSchema;
module.exports.TodoList = mongoose.model('todolist', TodoListSchema);
