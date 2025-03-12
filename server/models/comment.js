const express = require("express");
const router = express.Router();
const Comment = require("../models/comment");

// 📌 Recursive function to fetch all nested replies
const getNestedReplies = async (commentId) => {
  const replies = await Comment.find({ parentComment: commentId })
    .populate("user", "username")
    .lean();

  for (let reply of replies) {
    reply.replies = await getNestedReplies(reply._id);
  }

  return replies;
};

// 📝 Get Comments with All Nested Replies (Threaded Format)
router.get("/:postId", async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId, parentComment: null })
      .populate("user", "username")
      .lean(); // Convert to plain JS objects

    for (let comment of comments) {
      comment.replies = await getNestedReplies(comment._id);
    }

    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
