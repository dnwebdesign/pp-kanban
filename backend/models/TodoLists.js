const mongoose = require('mongoose');
const { todosSchema } = require('../models/Todos');

const TodoListSchema = new mongoose.Schema({
    title: String,
    todos: [{type: mongoose.Schema.Types.ObjectId, ref: 'todos'}],
});

module.exports.todoListSchema = TodoListSchema;
module.exports.TodoList = mongoose.model('todolist', TodoListSchema);
