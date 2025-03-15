import express from "express";
import auth from "./src/routes/auth.js";
import dotenv from "dotenv";
import { connectDB } from "./src/config/db.js";
import cookieParser from "cookie-parser";
import message from "./src/routes/message.js";
import bodyParser from "body-parser";
import cors from "cors";

import { app, server } from "./src/config/socket.js";

dotenv.config();

app.use(express.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// Simple CORS setup to allow all origins (public API use)
app.use(
  cors({
    origin: "*",   // Allow all origins
    credentials: true, // Allow cookies and credentials to be sent with requests
  })
);

app.use("/api/auth", auth);
app.use("/api/messages", message);

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  connectDB();
});
