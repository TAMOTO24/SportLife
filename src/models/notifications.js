const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "accounts",
  },
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  access: String,
  readStatus: Array,
  type: {
    type: String,
    enum: ["info", "success", "error"],
    default: "info",
  }
});

const notification =
  mongoose.models.notifications ||
  mongoose.model("notifications", notificationSchema);

module.exports = notification;
