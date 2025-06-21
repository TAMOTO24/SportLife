const express = require("express");
const router = express.Router();
const Trainers = require("../../models/trainers");

router.get("/trainers", async (req, res) => {
  // Take all trainers data from member Collection
  try {
    const trainers = await Trainers.find();
    res.json(trainers);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

module.exports = router;