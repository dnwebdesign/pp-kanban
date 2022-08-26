const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {List} = require('../models/Lists');
const {Task} = require('../models/Tasks');
const {TodoList} = require("../models/TodoLists");
const {Todo} = require("../models/Todos");

// Get all lists
router.get('/', async (req, res) => {
    const lists = await List.find().populate({
        path: 'tasks',
        model: Task,
        populate: [{
            path: 'todoLists',
            model: TodoList,
            populate: [{
                path: 'todos',
                model: Todo
            }],
        }],
    });
    res.json(lists);
});

// Create new list
router.post('/new', async (req, res) => {
    const newList = new List(req.body);

    const savedList = await newList.save();

    res.json(savedList);
});

// Delete a list
router.delete('/delete/:id', async (req, res) => {
    await List.deleteOne({_id: req.params.id}).then(async () => {

        await Task.find({list: req.params.id}).then(async (tasksData) => {
            for (const tk of tasksData) {
                await Task.deleteMany({list: req.params.id});

                await TodoList.find({task: tk.id}).then(async (todoListsData) => {
                    for (const tl of todoListsData) {
                        await TodoList.deleteMany({task: tk.id});

                        await Todo.find({todoList: tl.id}).then(async (todosData) => {
                            for (const td of todosData) {
                                await Todo.deleteMany({todoList: tl.id});
                            }
                        });
                    }
                });
            }
        });
    });
});

// Update a list
router.patch('/update/:id', async (req, res) => {
    const q = await List.updateOne({_id: req.params.id}, {$set: req.body});
    res.json(q);
});

// Add a task to a list
router.post("/addTask/:id", (req, res) => {

    List.findById(req.params.id, async function (err, result) {
        if (!err) {
            if (!result) {
                res.sendStatus(404).send('List was not found').end();
            } else {
                let newTask = new Task(req.body);
                newTask.list = req.params.id;
                await newTask.save();
                result.tasks.push(newTask._id);
                result.markModified('tasks');
                result.save(function (saveerr, saveresult) {
                    if (!saveerr) {
                        res.status(200).send(saveresult);
                    } else {
                        res.status(400).send(saveerr.message);
                    }
                });
            }
        } else {
            res.status(400).send(err.message);
        }
    });
});

// Add a todolist to a task
router.post("/addTodoList/:id", (req, res) => {

    Task.findById(req.params.id, async function (err, result) {
        if (!err) {
            if (!result) {
                res.sendStatus(404).send('Task was not found').end();
            } else {
                let newTodoList = new TodoList(req.body);
                newTodoList.task = req.params.id;
                await newTodoList.save();
                result.todoLists.push(newTodoList._id);
                result.markModified('tasks');
                result.save(function (saveerr, saveresult) {
                    if (!saveerr) {
                        res.status(200).send(saveresult);
                    } else {
                        res.status(400).send(saveerr.message);
                    }
                });
            }
        } else {
            res.status(400).send(err.message);
        }
    });
});

// Get a todolist
router.get('/getTodoList/:id', async (req, res) => {
    const todoList = await TodoList.findById(req.params.id).populate({
        path: 'todos',
        model: Todo
    });
    res.json(todoList);
});


// Update a todolist
router.patch('/updateTodoList/:id', async (req, res) => {
    const q = await TodoList.updateOne({_id: req.params.id}, {$set: req.body});
    res.json(q);
});

// Delete a todolist
router.delete('/deleteTodoList/:id', async (req, res) => {
    const result = await TodoList.findByIdAndDelete({_id: req.params.id});
    await Todo.deleteMany({todoList: req.params.id});
    res.json(result);
});

// Add a todo to a todolist
router.post("/addTodo/:id", (req, res) => {

    TodoList.findById(req.params.id, async function (err, result) {
        if (!err) {
            if (!result) {
                res.sendStatus(404).send('Task was not found').end();
            } else {
                let newTodo = new Todo(req.body);
                newTodo.todoList = req.params.id;
                await newTodo.save();
                result.todos.push(newTodo._id);
                result.markModified('tasks');
                result.save(function (saveerr, saveresult) {
                    if (!saveerr) {
                        res.status(200).send(saveresult);
                    } else {
                        res.status(400).send(saveerr.message);
                    }
                });
            }
        } else {
            res.status(400).send(err.message);
        }
    });
});

// Update a todo
router.patch('/updateTodo/:id', async (req, res) => {
    const q = await Todo.updateOne({_id: req.params.id}, {$set: req.body});
    res.json(q);
});

// Delete a todo
router.delete('/deleteTodo/:id', async (req, res) => {
    const result = await Todo.findByIdAndDelete({_id: req.params.id});
    const todolist = await TodoList.updateOne(
        {_id: req.body.todoList},
        {
            $pull: {
                'todos': req.params.id
            }
        }
    );

    res.json(result);
});

module.exports = router;
