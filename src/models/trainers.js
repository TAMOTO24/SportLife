const mongoose = require("mongoose");

const trainersSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    info: String,
    training_type: String,
    profile_img: String,
    title: String,
    name: String,
    bio: String,
    philosophy: [String],
    education: String,
    achievements: [String],
    targetAudience: String,
});

module.exports = mongoose.models.trainers || mongoose.model("trainers", trainersSchema);
