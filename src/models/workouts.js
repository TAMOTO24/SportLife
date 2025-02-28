const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
    description: String,
    type: Array,
    workoutplan: Object,
    body_activity: Object,
    exercise_machines: Array,
    data: Date,
    trainer: String,
    img: Array,
});

module.exports = mongoose.models.workouts || mongoose.model('workouts', workoutSchema);