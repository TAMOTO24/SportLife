const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  data: {
    type: Date,
    default: Date.now
  },
  sex: String,
});

module.exports = mongoose.models.accounts || mongoose.model('accounts', userSchema);