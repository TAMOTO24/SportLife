const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  // _id: ObjectId,
  text: String,
  created_by: String,
  date: {
    type: Date,
    default: Date.now,
  },
  gallery: Array,
  comment: Array,
  like: Array,
});

module.exports = mongoose.models.posts || mongoose.model("posts", postSchema);