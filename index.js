import express from "express";
import auth from "./src/routes/auth.js";
import dotenv from "dotenv";
import { connectDB } from "./src/config/db.js";
import cookieParser from "cookie-parser";
import message from "./src/routes/message.js";
import bodyParser from "body-parser";
const cors = require('cors');
import { app, server } from "./src/config/socket.js";

dotenv.config();

app.use(express.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// Set frontend URL to match your deployment URL

// CORS setup to allow credentials and specific origin
app.use(
  cors({
    origin: 'https://vibe-chat-omega.vercel.app',  // Replace with your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,  // Allow credentials (cookies, headers, etc.)
  })
);


app.use("/api/auth", auth);
app.use("/api/messages", message);

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  connectDB();
});
