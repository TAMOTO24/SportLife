const express = require("express");
const router = express.Router();
const Notification = require("../../models/notifications");

router.post("/notification", async (req, res) => {
  const { access, title, message, userId, url, type, action, fromWho } =
    req.body;

  try {
    const newNotification = new Notification({
      access: access === "all" ? access : userId,
      title,
      date: new Date(),
      message,
      url,
      type,
      fromWho,
      readStatus: [],
      action,
    });
    await newNotification.save();
    res
      .status(201)
      .json({ message: "Notification created successfully", newNotification });
  } catch (err) {
    return res.status(500).json({ message: "Notification error!" });
  }
});

router.delete("/notification/:notificationId", async (req, res) => {
  const { notificationId } = req.params;

  try {
    if (!notificationId) {
      return res.status(204).json({ message: "No Id as query" });
    }

    const notification = await Notification.findByIdAndDelete(notificationId);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/notification/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    if (!userId) {
      return res.status(204).json({ message: "No Id as query" });
    }

    const notifications = await Notification.findOne({
      $and: [
        { $or: [{ access: "all" }, { access: userId }] },
        { readStatus: { $nin: [userId] } },
      ],
    }).sort({ date: -1 });

    if (!notifications) {
      return res.status(204).json({ message: "No notifications found" });
    }
    if (notifications.readStatus.includes(userId)) {
      return res.status(204).json({ message: "Notification already read" });
    }

    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/allnotifications/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    if (!userId) {
      return res.status(204).json({ message: "No Id as query" });
    }
    const notifications = await Notification.find({
      $or: [{ access: "all" }, { access: userId }],
    }).sort({ date: -1 });

    if (!notifications) {
      return res.status(204).json({ message: "No notifications found" });
    }

    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/notification/:userId", async (req, res) => {
  const { userId } = req.params;
  const { notificationId } = req.body;

  try {
    if (!notificationId) {
      return res.status(204).json({ message: "No Id as query" });
    }

    const notification = await Notification.findOne({
      $or: [{ access: "all" }, { access: userId }],
      _id: notificationId,
    });

    if (!notification) {
      return res.status(204).json({ message: "Notification not found" });
    }
    if (notification.readStatus.includes(userId)) {
      return res.status(204).json({ message: "Notification already read" });
    }
    notification.readStatus.push(userId);
    await notification.save();

    res
      .status(200)
      .json({ message: "Notification updated successfully", notification });
  } catch (error) {
    console.error("Error updating notification:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;