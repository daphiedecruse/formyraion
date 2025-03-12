const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ["reply", "mention", "new_picture"], required: true },
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: false },
  commentId: { type: mongoose.Schema.Types.ObjectId, ref: "Comment", required: false },
  read: { type: Boolean, default: false }, // New field
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Notification", notificationSchema);
