const express = require("express");
const Post = require("../models/post");
const User = require("../models/user");
const Notification = require("../models/notification");

const router = express.Router();

// Upload a new post
router.post("/upload", async (req, res) => {
  try {
    const { userId, imageUrl } = req.body;
    const newPost = new Post({ userId, imageUrl });
    await newPost.save();

    // Notify all followers
    const user = await User.findById(userId).populate("followers");
    if (user && user.followers.length > 0) {
      for (let follower of user.followers) {
        await new Notification({
          user: follower._id,
          sender: userId,
          type: "new_picture",
          postId: newPost._id
        }).save();

        // Emit real-time notification
        io.emit("notification", {
          recipientId: follower._id.toString(),
          message: `${user.username} uploaded a new picture!`
        });
      }
    }

    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Get all posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().populate("userId", "username");
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
