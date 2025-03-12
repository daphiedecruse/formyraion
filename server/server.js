const express = require("express");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

dotenv.config();
const app = express();


// Import Routes
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");




// Use Routes
app.use("/api/user")
app.use("/api/posts", postRoutes);
app.app.use(express.json());use("/api/comments", commentRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
