const { notification } = require('antd');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  name: String,
  last_name: String,
  email: String,
  password: String,
  date: {
    type: Date,
    default: Date.now
  },
  gender: String,
  name: String,
  last_name: String,
  phone: String,
  profile_picture: String,
  role: String,
  profileDescription: String,
  notifications: {
    type: Array,
    default: [],
  }
});

module.exports = mongoose.models.accounts || mongoose.model('accounts', userSchema);