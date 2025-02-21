const mongoose = require("mongoose");

const emailSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String
});

module.exports = mongoose.models.accounts || mongoose.model('accounts', emailSchema);