const mongoose = require("mongoose");

const requestsSchema = new mongoose.Schema({
  userId: String,
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  }, // pending, accepted, rejected
  email: String,
  requestReason: String, // trainer, admin
});

module.exports =
  mongoose.models.requests || mongoose.model("requests", requestsSchema);
