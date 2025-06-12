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
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "accounts",
    },
    cameraStatus: Boolean,
});

module.exports = mongoose.models.room || mongoose.model("room", roomSchema);
