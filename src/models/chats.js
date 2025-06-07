const mongoose = require("mongoose");
const { Schema } = mongoose;

const messageSchema = new Schema({
  _id: {
    type: String,
    default: () => new mongoose.Types.ObjectId().toString(),
  },
  date: { type: String, required: true },
  message: { type: String, required: true },
  fromId: { type: String, required: true },
});

const chatSchema = new Schema({
  history: { type: [messageSchema], default: [] },
  chating: { type: [Schema.Types.Mixed], default: [] },
});

module.exports = mongoose.models.chats || mongoose.model("chats", chatSchema);
