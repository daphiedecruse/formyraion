const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    content: { type: String, required: true }, // Required field
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Required field
    image: { type: String }, // Optional
});

module.exports = mongoose.model("Post", postSchema);
