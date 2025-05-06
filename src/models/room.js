const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
    roomId: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
    data: {
        type: Object,
        default: () => ({}),
    },
    users: Array,
});

module.exports = mongoose.models.room || mongoose.model("room", roomSchema);
