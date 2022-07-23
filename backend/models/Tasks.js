const mongoose = require('mongoose');
const { todoListSchema } = require('./TodoLists');

const TasksSchema = new mongoose.Schema({
    title: String,
    todoLists: [{type: mongoose.Schema.Types.ObjectId, ref: 'todolists'}],
    list: mongoose.Schema.Types.ObjectId
});

module.exports.tasksSchema = TasksSchema;
module.exports.Task = mongoose.model('task', TasksSchema);
