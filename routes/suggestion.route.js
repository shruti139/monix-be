const express = require('express');
const Suggestion = require('../models/suggestion.medel');
const validateSuggestion = require('../validation/suggestion');
const { validate } = require('express-validation');
const fs = require('fs');
const router = express.Router();

// GET all suggestions
router.get('/', async (req, res) => {
    try {
        const suggestions = await Suggestion.find();
        res.json(suggestions);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// POST a new suggestion
router.post('/ads/add', async (req, res) => {


    try {
        fs.writeFile('public/ads.json', JSON.stringify(req?.body), (err) => {
            if (err) {
                console.error('Error writing file', err);
            } else {
                return res.status(200).json({ status: 200, message: "Ads updated successfully", });
            }
        });
    }
    catch (error) {
        return res.status(500).json({ status: 500, message: "Something went wrong", });
    }
});

// POST a new suggestion
router.post('/add', validate(validateSuggestion.addSuggestion), async (req, res) => {


    const { name, suggestion } = req.body;
    try {
        const newSuggestion = new Suggestion({ name, suggestion });
        await newSuggestion.save();
        res.json(newSuggestion);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// GET a suggestion by ID
router.get('/:id', async (req, res) => {
    try {
        const suggestion = await Suggestion.findById(req.params.id);
        if (!suggestion) return res.status(404).send('Suggestion not found');
        res.json(suggestion);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// DELETE a suggestion by ID
router.delete('/:id', async (req, res) => {
    try {
        const suggestion = await Suggestion.findByIdAndDelete(req.params.id);
        if (!suggestion) return res.status(404).send('Suggestion not found');
        res.json({ msg: 'Suggestion removed' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;
