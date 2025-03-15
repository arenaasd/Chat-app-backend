import express from "express";
import auth from "./src/routes/auth.js";
import dotenv from "dotenv";
import { connectDB } from "./src/config/db.js";
import cookieParser from "cookie-parser";
import message from "./src/routes/message.js";
import bodyParser from "body-parser";
import cors from "cors"; // Keep only one import of 'cors'

import { app, server } from "./src/config/socket.js";

dotenv.config();

app.use(express.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// Frontend URL from environment variable (or fallback to localhost during development)
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

// Set up CORS to allow cookies and credentials
const allowedOrigins = ['https://vibe-chat-omega.vercel.app'];

// Set up CORS with credentials
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true); // Allow the request
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // Allow sending cookies with the request
}));

app.use("/api/auth", auth);
app.use("/api/messages", message);

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  connectDB();
});
