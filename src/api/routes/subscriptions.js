const express = require("express");
const router = express.Router();
const Subscriptions = require("../../models/subscriptions");

router.post("/subscribe", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Невалідна email-адреса" });
  }

  try {
    const exists = await Subscriptions.findOne({ email });
    if (exists) {
      return res.status(200).json({ message: "Ви вже підписані" });
    }

    await Subscriptions.create({
      email,
      subscribedAt: new Date(),
    });

    res.status(201).json({ message: "Підписка успішна!" });
  } catch (err) {
    res.status(500).send(`Server error: ${err}`);
  }
});

module.exports = router;