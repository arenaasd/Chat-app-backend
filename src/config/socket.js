import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

// Setup Socket.IO with proper CORS configuration
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,  // Ensure FRONTEND_URL is correct in your .env
    credentials: true,  // Allow credentials (cookies, authorization headers)
  },
  transports: ['websocket', 'polling'],  // Prefer WebSocket transport but allow polling as fallback
});

const userSocketMap = {}; // Map to track userId to socketId mapping

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId; // Extract userId from handshake query

  if (userId) {
    userSocketMap[userId] = socket.id;  // Store userId to socketId mapping
    console.log(`User ${userId} connected with socket ID: ${socket.id}`);
  } else {
    console.error("No userId provided in handshake query!");
  }

  // Emit the online users to all connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Listen for disconnect event
  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);

    // Remove the user from the map when disconnected
    if (userId) {
      delete userSocketMap[userId];
      console.log(`User ${userId} disconnected`);
    }

    // Emit updated online users list
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });

  // Handle any socket errors gracefully
  socket.on('error', (err) => {
    console.error('Socket error:', err);
  });
});

export { io, app, server };
