const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    exercises: Array,
});

const Exercises = mongoose.models.exercises || mongoose.model('exercises', itemSchema);

module.exports = Exercises;
