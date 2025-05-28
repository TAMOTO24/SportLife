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
  statistic: Array,
  trainerRequestId: String,
  bookmarks: Array,
});

module.exports = mongoose.models.accounts || mongoose.model('accounts', userSchema);