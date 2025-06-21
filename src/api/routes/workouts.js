const express = require("express");
const router = express.Router();
const Workouts = require("../../models/workouts");
const mongoose = require("mongoose");
const Exercises = require("../../models/exercises");

router.get("/api/workouts/:type", async (req, res) => {
  const { type } = req.params;
  try {
    const items = await Workouts.find({ type });
    res.json(items);
  } catch (error) {
    res.status(500).send("Server error");
  }
});
router.get("/workoutbyid/:workoutid", async (req, res) => {
  const { workoutid } = req.params;
  if (!workoutid) {
    res.status(400).send("Workout id is required!");
  }
  try {
    const items = await Workouts.findById(workoutid);
    res.json(items);
  } catch (error) {
    res.status(500).send("Server error");
  }
});
router.get("/exercises/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  const exercises = await Exercises.findById(id);

  if (!exercises) {
    return res
      .status(500)
      .json({ message: "There are no such exercises by that id" });
  }
  res.json(exercises);
});

module.exports = router;