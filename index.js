import express from "express";
import auth from "./src/routes/auth.js";
import dotenv from "dotenv";
import { connectDB } from "./src/config/db.js";
import cookieParser from "cookie-parser";
import message from "./src/routes/message.js";
import cors from "cors";
import bodyParser from "body-parser";
import { app , server } from "./src/config/socket.js";

connectDB();


app.use(express.json({ limit: "10mb" })); 
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));
dotenv.config();
app.use(cookieParser())


// Set up CORS with the dynamic frontend URL
app.use(
  cors({
    origin: process.env.FRONTEND_URL,  // The frontend URL should be dynamic based on environment
    credentials: true,  // Allow cookies to be sent with requests
    methods: ["GET", "POST", "PUT", "DELETE"],  // Specify allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"],  // Specify allowed headers
  })
);
app.use("/api/auth", auth)
app.use("/api/messages", message)



const port = process.env.PORT
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

