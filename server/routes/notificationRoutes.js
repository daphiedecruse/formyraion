const express = require("express");
const Notification = require("../models/notification");
const router = express.Router();

// Get unread notifications for a user
router.get("/:userId", async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.params.userId, read: false })
      .sort({ createdAt: -1 })
      .populate("sender", "username");
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mark all notifications as read
router.put("/:userId/markAsRead", async (req, res) => {
  try {
    await Notification.updateMany({ user: req.params.userId, read: false }, { read: true });
    res.json({ message: "Notifications marked as read" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
