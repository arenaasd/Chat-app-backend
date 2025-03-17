// In your socket.js file

import { Server } from "socket.io";
import http from "http";
import express from "express";

// Define app and server
const app = express();
const server = http.createServer(app);

// Initialize io (ensure this is initialized before using it)
const io = new Server(server, {
  cors: {
    origin: [process.env.FRONTEND_URL],
  },
});

// used to store online users
const userSocketMap = {}; // {userId: socketId}

// Export the function to get the receiver socket ID
export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// Export io, app, and server so other files can use them
export { io, app, server };
