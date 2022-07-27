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
    console.log(lists[0].tasks[0]);
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
    const result = await List.findByIdAndDelete({_id: req.params.id});

    res.json(result);
});

// Update a list
router.patch('/update/:id', async (req, res) => {
    console.log(req.body);
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
router.put("/addTodoList/:id", (req, res) => {

    Task.findById(req.params.id, async function (err, result) {
        if (!err) {
            if (!result) {
                res.sendStatus(404).send('Task was not found').end();
            } else {
                let newTodoList = new TodoList(req.body);
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

// Add a todo to a todolist
router.put("/addTodo/:id", (req, res) => {

    TodoList.findById(req.params.id, async function (err, result) {
        if (!err) {
            if (!result) {
                res.sendStatus(404).send('Task was not found').end();
            } else {
                let newTodo = new Todo(req.body);
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
    console.log(req.body);
    const q = await Todo.updateOne({_id: req.params.id}, {$set: req.body});
    res.json(q);
});

module.exports = router;
