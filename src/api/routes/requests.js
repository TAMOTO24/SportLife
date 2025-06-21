const express = require("express");
const router = express.Router();
const User = require("../../models/user");
const Request = require("../../models/requests");

router.get("/request/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "No ID provided" });
    }

    const request = await Request.findById(id);

    if (!request) {
      return res.status(204).json({ message: "No request found" });
    }
    res.status(200).json(request);
  } catch (error) {
    console.error("Error fetching request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
router.get("/rejectchangerequest/:id", async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) {
      return res.status(204).json({ message: "No Id as query" });
    }

    const request = await Request.findOne({ userId: id });
    if (!request) {
      return res.status(204).json({ message: "Request not found" });
    }
    request.status = "rejected";
    await request.save();

    res.send("Роль відхилена!");
  } catch (error) {
    console.error("Error rejecting change request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/acceptchangerequest/:id/:role", async (req, res) => {
  const { id, role } = req.params;

  try {
    if (!id || !role) {
      return res.status(204).json({ message: "No Id or role as query" });
    }

    const request = await Request.findOne({ userId: id });
    if (!request) {
      return res.status(204).json({ message: "Request not found" });
    }
    request.status = "accepted";
    await request.save();

    const user = await User.findById(request.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.role = role; // Update user role to trainer
    if (role === "trainer") user.trainerRequestId = null; // Clear trainer request ID
    await user.save();

    res.send("Роль успішно підтверджена!");
  } catch (error) {
    console.error("Error accepting change request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;