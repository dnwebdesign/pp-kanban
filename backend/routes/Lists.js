const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {List} = require('../models/List');
const {Card} = require('../models/Card');
const {TodoList} = require("../models/Todolist");
const {Todo} = require("../models/Todo");

// Get all lists
router.get('/', async (req, res) => {
    const lists = await List.find().populate({
        path: 'cards',
        model: Card,
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
    const result = await List.deleteOne({_id: req.params.id}).then(async () => {

        await Card.find({list: req.params.id}).then(async (cardsData) => {
            for (const tk of cardsData) {
                await Card.deleteMany({list: req.params.id});

                await TodoList.find({card: tk.id}).then(async (todoListsData) => {
                    for (const tl of todoListsData) {
                        await TodoList.deleteMany({card: tk.id});

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
    res.json(result);
});

// Update a list
router.patch('/update/:id', async (req, res) => {
    const q = await List.updateOne({_id: req.params.id}, {$set: req.body});
    res.json(q);
});

// Add a card to a list
router.post("/addCard/:id", (req, res) => {

    List.findById(req.params.id, async function (err, result) {
        if (!err) {
            if (!result) {
                res.sendStatus(404).send('List was not found').end();
            } else {
                let newCard = new Card(req.body);
                newCard.list = req.params.id;
                await newCard.save();
                result.cards.push(newCard._id);
                result.markModified('cards');
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

// Update a card
router.patch('/updateCard/:id', async (req, res) => {
    const q = await Card.updateOne({_id: req.params.id}, {$set: req.body});
    res.json(q);
});

// Delete a card
router.delete('/deleteCard/:id', async (req, res) => {
    const result = await Card.deleteOne({_id: req.params.id}).then(async () => {
        await TodoList.find({card: req.params.id}).then(async (todoListsData) => {
            for (const tl of todoListsData) {
                await TodoList.deleteMany({card: req.params.id});

                await Todo.find({todoList: tl.id}).then(async (todosData) => {
                    for (const td of todosData) {
                        await Todo.deleteMany({todoList: tl.id});
                    }
                });
            }
        });
    });
    res.json(result);
});

// Add a todolist to a card
router.post("/addTodoList/:id", (req, res) => {

    Card.findById(req.params.id, async function (err, result) {
        if (!err) {
            if (!result) {
                res.sendStatus(404).send('Card was not found').end();
            } else {
                let newTodoList = new TodoList(req.body);
                newTodoList.card = req.params.id;
                await newTodoList.save();
                result.todoLists.push(newTodoList._id);
                result.markModified('cards');
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
                res.sendStatus(404).send('Card was not found').end();
            } else {
                let newTodo = new Todo(req.body);
                newTodo.todoList = req.params.id;
                await newTodo.save();
                result.todos.push(newTodo._id);
                result.markModified('cards');
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
