const express = require("express");
const Comment = require("../models/comment");
const User = require("../models/user");
const Notification = require("../models/notification");

const router = express.Router();

// Add a new comment
router.post("/:postId/reply", async (req, res) => {
  try {
    const { userId, text, parentComment } = req.body;
    const newComment = new Comment({ postId: req.params.postId, userId, text, parentComment });
    await newComment.save();

    const parent = await Comment.findById(parentComment).populate("userId");

    // Notify the original comment owner
    if (parent && parent.userId._id.toString() !== userId) {
      await new Notification({
        user: parent.userId._id,
        sender: userId,
        type: "reply",
        postId: req.params.postId,
        commentId: newComment._id
      }).save();

      io.emit("notification", {
        recipientId: parent.userId._id.toString(),
        message: `${parent.userId.username}, you got a reply!`
      });
    }

    // Notify mentioned users
    const mentions = text.match(/@(\w+)/g);
    if (mentions) {
      for (let mention of mentions) {
        const username = mention.slice(1);
        const mentionedUser = await User.findOne({ username });

        if (mentionedUser && mentionedUser._id.toString() !== userId) {
          await new Notification({
            user: mentionedUser._id,
            sender: userId,
            type: "mention",
            postId: req.params.postId,
            commentId: newComment._id
          }).save();

          io.emit("notification", {
            recipientId: mentionedUser._id.toString(),
            message: `${mentionedUser.username}, you were mentioned in a comment!`
          });
        }
      }
    }

    res.status(201).json(newComment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Reply to a comment & notify the original commenter
router.post("/:postId/reply", async (req, res) => {
  try {
    const { userId, text, parentComment } = req.body;
    const newComment = new Comment({ postId: req.params.postId, userId, text, parentComment });
    await newComment.save();

    // 🔔 Notify the original comment owner
    const parent = await Comment.findById(parentComment).populate("userId");
    if (parent && parent.userId._id.toString() !== userId) {
      await new Notification({
        user: parent.userId._id,
        sender: userId,
        type: "reply",
        postId: req.params.postId,
        commentId: newComment._id
      }).save();
    }

    // 🔔 Notify mentioned users
    const mentions = text.match(/@(\w+)/g);
    if (mentions) {
      for (let mention of mentions) {
        const username = mention.slice(1);
        const mentionedUser = await User.findOne({ username });

        if (mentionedUser && mentionedUser._id.toString() !== userId) {
          await new Notification({
            user: mentionedUser._id,
            sender: userId,
            type: "mention",
            postId: req.params.postId,
            commentId: newComment._id
          }).save();
        }
      }
    }

    res.status(201).json(newComment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all comments for a post
router.get("/:postId", async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).populate("userId", "username");
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
