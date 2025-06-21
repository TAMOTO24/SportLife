const express = require("express");
const router = express.Router();
const Room = require("../../models/room");

router.get("/room/:id", async (req, res) => {
  const { id } = req.params;

  // if (!mongoose.Types.ObjectId.isValid(id)) {
  //   return res.status(400).json({ message: "Invalid room ID format!" });
  // }
  try {
    const room = await Room.findOne({ roomId: id });
    if (!room) {
      return res
        .status(400)
        .json({ message: "There are no room with such id!" });
    }
    res.json(room);
  } catch (error) {
    res.status(500).send(`Server error ${error}`);
  }
});

module.exports = router;