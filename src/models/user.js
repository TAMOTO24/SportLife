const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  name: String,
  last_name: String,
  email: String,
  password: String,
  data: {
    type: Date,
    default: Date.now
  },
  gender: String,
  name: String,
  last_name: String,
  phone: String,
  profile_picture: String,
  role: String
});

module.exports = mongoose.models.accounts || mongoose.model('accounts', userSchema);