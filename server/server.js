const express = require("express");
const http = require("http"); // Required for Socket.io
const mongoose = require("mongoose");
const cors = require("cors");
const socketIo = require("socket.io"); // Import Socket.io
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");
const notificationRoutes = require("./models/notification");
const app = express();
const server = http.createServer(app); // Create HTTP server
const io = socketIo(server, {
  cors: {
    origin: "*", // Allow all origins (or set specific frontend URL)
    methods: ["GET", "POST"]
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

mongoose.connect("mongodb://localhost:27017/valentinesApp", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/notifications", notificationRoutes);

const onlineUsers = new Map();

// Handle Socket.io connections
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Store user's socket ID when they join
  socket.on("register", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  // Handle new notifications
  socket.on("newNotification", async ({ recipientId, message }) => {
    if (onlineUsers.has(recipientId)) {
      io.to(onlineUsers.get(recipientId)).emit("notification", message);
    }
  });

  // Remove user on disconnect
  socket.on("disconnect", () => {
    for (let [key, value] of onlineUsers.entries()) {
      if (value === socket.id) {
        onlineUsers.delete(key);
        break;
      }
    }
    console.log("User disconnected:", socket.id);
  });
});

// Start server
server.listen(5000, () => {
  console.log("Server running on port 5000");
});
