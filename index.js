import express from "express";
import auth from "./src/routes/auth.js";
import dotenv from "dotenv";
import { connectDB } from "./src/config/db.js";
import cookieParser from "cookie-parser";
import message from "./src/routes/message.js";
import bodyParser from "body-parser";
import cors from "cors";
import { app, server } from "./src/config/socket.js";

// Load environment variables
dotenv.config();

// Use JSON body parser with a 10mb size limit
app.use(express.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));

// Enable cookie parser
app.use(cookieParser());

// Set up CORS to allow requests from your frontend and include cookies
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
const allowedOrigins = [
  'https://vibe-chat-omega.vercel.app', // Your deployed frontend URL
];

// Configure CORS
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);  // Allow the request
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // Allow cookies with the request
}));

// Set up routes
app.use("/api/auth", auth);
app.use("/api/messages", message);

// Start server and connect to the database
const port = process.env.PORT || 5000;  // Ensure default port if not provided
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  connectDB();
});
