import express from "express";
import auth from "./src/routes/auth.js";
import dotenv from "dotenv";
import { connectDB } from "./src/config/db.js";
import cookieParser from "cookie-parser";
import message from "./src/routes/message.js";
import bodyParser from "body-parser";
import cors from "cors";
import { app , server } from "./src/config/socket.js";


app.use(express.json({ limit: "10mb" })); 
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));
dotenv.config();
app.use(cookieParser())
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

// Set up CORS with the dynamic frontend URL
app.use(cors({
    origin: frontendUrl,  // Use FRONTEND_URL or fallback to localhost:5173
    credentials: true  // Allow credentials (cookies, authorization headers)
}));

app.use("/api/auth", auth)
app.use("/api/messages", message)



const port = process.env.PORT
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    connectDB();
});

