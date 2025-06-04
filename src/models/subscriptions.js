const mongoose = require("mongoose");

const subscriptionsSchema = new mongoose.Schema({
  email: String,
  subscribedAt: Date,
});

module.exports =
  mongoose.models.subscriptions ||
  mongoose.model("subscriptions", subscriptionsSchema);
