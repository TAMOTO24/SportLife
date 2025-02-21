const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String
});

const Item = mongoose.models.Item || mongoose.model('Item', itemSchema);

module.exports = Item;
