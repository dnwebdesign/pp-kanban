const express = require('express');
const router = express.Router();
const List = require('../models/Lists');

// Get all lists
router.get('/', async (req, res) => {
    const lists = await List.find();

    res.json(lists);
});

// Create new list
router.post('/new', async (req, res) => {
    const newList = new List(req.body);

    const savedList = await newList.save();

    res.json(savedList);
});

// Get specific list
router.get('/get/:id', async (req, res) => {
    const q = await List.findById({ _id: req.params.id });

    res.json(q);
});

// Delete a list
router.delete('/delete/:id', async (req, res) => {
    const result = await List.findByIdAndDelete({ _id: req.params.id });

    res.json(result);
});

// Update a list
router.patch('/update/:id', async (req, res) => {
    console.log(req.body);
    const q = await List.updateOne({ _id: req.params.id  }, {$set: req.body});
    res.json(q);
});

// Get random list
router.get('/random', async (req, res) => {
    const count = await List.countDocuments();
    const random = Math.floor(Math.random() * count);
    const q = await List.findOne().skip(random);

    res.json(q);
});

module.exports = router;
