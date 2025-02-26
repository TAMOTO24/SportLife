const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  // _id: ObjectId,
  text: String,
  user: String,
  username: String,
  data: {
    type: Date,
    default: Date.now,
  },
  gallery: Array,
  userIcon: String,
  comment: Array,
  like: Array,
});

module.exports = mongoose.models.posts || mongoose.model("posts", postSchema);
