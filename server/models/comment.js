const mongoose = require("mongoose");
const moment = require("moment");

const commentSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  parentComment: { type: mongoose.Schema.Types.ObjectId, ref: "Comment", default: null }, // For replies
  createdAt: { type: Date, default: Date.now }
});


commentSchema.virtual("timeAgo").get(function () {
  return moment(this.createdAt).fromNow();
});

module.exports = mongoose.model("Comment", commentSchema);
