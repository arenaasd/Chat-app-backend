import express from "express";
import auth from "./routes/auth.js";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import cookieParser from "cookie-parser";
import message from "./routes/message.js";
import bodyParser from "body-parser";
import cors from "cors";
import { app , server } from "./config/socket.js";


app.use(express.json({ limit: "10mb" })); 
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));
dotenv.config();
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))


app.use("/api/auth", auth)
app.use("/api/messages", message)



const port = process.env.PORT
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    connectDB();
});