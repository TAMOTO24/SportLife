const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: String,
  age: Number,
});

module.exports = mongoose.model("members", itemSchema);