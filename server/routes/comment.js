const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
    text: { type: String, required: true },
    parentComment: { type: mongoose.Schema.Types.ObjectId, ref: "Comment", default: null }, // For replies
    replies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }] // Store replies
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", CommentSchema);
