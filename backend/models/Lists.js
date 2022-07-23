const mongoose = require('mongoose');

const ListsSchema = new mongoose.Schema({
    title: String,
    tasks: [{type: mongoose.Schema.Types.ObjectId, ref: 'tasks'}],
});

module.exports.listsSchema = ListsSchema;
module.exports.List = mongoose.model('list', ListsSchema);

/*
new mongoose.Schema({
            title: String,
            todoList: new mongoose.Schema({
                title: String,
                todos: [
                    new mongoose.Schema({
                        title: String,
                    })
                ],
            }),
        })
 */
/*
const TodosSchema = new mongoose.Schema({
    description: String,
    done: Boolean,
});
const TodoListSchema = new mongoose.Schema({
    title: String,
    todos: [TodosSchema],
});
const TasksSchema = new mongoose.Schema({
    title: String,
    todoList: [TodoListSchema],
});
const ListsSchema = new mongoose.Schema({
    id: Number,
    title: String,
    tasks:  [TasksSchema],
});
module.exports = mongoose.model('todo', TodosSchema)
module.exports = mongoose.model('todolist', TodoListSchema)
module.exports = mongoose.model('task', TasksSchema)
module.exports = mongoose.model('list', ListsSchema)
 */
