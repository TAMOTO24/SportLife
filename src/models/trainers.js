const mongoose = require("mongoose");

const trainersSchema = new mongoose.Schema({
    // user_id: ObjectId,
    info: String,
    training_type: String,
    profile_img: String,
    title: String,
    name: String,
});

module.exports = mongoose.models.trainers || mongoose.model("trainers", trainersSchema);
