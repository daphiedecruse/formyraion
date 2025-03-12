const express = require("express");
const Post = require("../models/post");
const { verifyToken } = require("../middleware/authMiddleware"); // Middleware to protect routes
const router = express.Router();

// 📝 Create a new post
router.post("/", verifyToken, async (req, res) => {
  try {
    const { content, image } = req.body;
    const newPost = new Post({ user: req.user.id, content, image });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📜 Get all posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().populate("user", "username email").sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📄 Get a single post by ID
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("user", "username email");
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ❌ Delete a post (only the owner can delete)
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    if (post.user.toString() !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized to delete this post" });
    }

    await post.deleteOne();
    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 👍 Like or Unlike a post
router.put("/:id/like", verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const userId = req.user.id;

    if (post.likes.includes(userId)) {
      // Unlike the post
      post.likes = post.likes.filter((id) => id.toString() !== userId);
      await post.save();
      return res.json({ message: "Post unliked", post });
    } else {
      // Like the post
      post.likes.push(userId);
      await post.save();
      return res.json({ message: "Post liked", post });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
