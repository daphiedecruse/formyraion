const express = require("express");
const multer = require("multer");
const {bucket} = require("../config/firebase");
const Post = require("../models/post");
const User = require("../models/user");
const Notification = require("../models/notification");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // Store in memory before uploading to Firebase

// Upload a new post with an image
router.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const { user, content } = req.body; // Added content field
    if (!user || !content) {
      return res.status(400).json({ error: "User ID and content are required" });
    }
    console.log("File received:", req.file);
    if (!req.file) return res.status(400).json({ error: "No image uploaded" });
    console.log("File received:", req.file);
    // Upload image to Firebase Storage
        const file = bucket.file(req.file.originalname);
    const stream = file.createWriteStream({
      metadata: { contentType: req.file.mimetype },
    });

    stream.on("error", (err) => {
      console.error("Firebase upload error:", err);
      return res.status(500).json({ error: "Failed to upload image" });
    });

    stream.on("finish", async () => {
      await file.makePublic();
      const imageUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`;

      // Save post in MongoDB
      const newPost = new Post({ user: user, content, imageUrl }); // Added content
      await newPost.save();

      // Notify followers
      const user = await User.findById(user).populate("followers");
      if (user && user.followers.length > 0) {
        for (let follower of user.followers) {
          await new Notification({
            user: follower._id,
            sender: user,
            type: "new_picture",
            postId: newPost._id,
          }).save();

          // Emit real-time notification
          io.emit("notification", {
            recipientId: follower._id.toString(),
            message: `${user.username} uploaded a new picture!`,
          });
        }
      }

      res.status(201).json(newPost);
    });

    stream.end(req.file.buffer);
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get all posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().populate("user", "username");
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
