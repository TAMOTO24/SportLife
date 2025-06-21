const express = require("express");
const router = express.Router();
const Chats = require("../../models/chats");

router.get("/chat/:id/:companionId", async (req, res) => {
  const { id, companionId } = req.params;
  if (!id || !companionId) {
    return res.status(400).send("id is required!");
  }
  try {
    const chat = await Chats.findOne({
      chating: { $all: [id, companionId] },
    });
    res.json({ chatData: chat });
  } catch (error) {
    res.status(500).send(`Server error - ${error}`);
  }
});

router.get("/getallchats", async (req, res) => {
  try {
    const chats = await Chats.find();
    res.json(chats);
  } catch (error) {
    res.status(500).send(`Server error - ${error}`);
  }
});

module.exports = router;