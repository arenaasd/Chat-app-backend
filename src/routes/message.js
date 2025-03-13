import express from "express";
import { getMessage, getuserSidebar, sendMessage } from "../controllers/message.controllers.js";
const router = express.Router();
import isLoggedin from "../middlewares/auth.checkloggedin.js";

router.get("/users", isLoggedin, getuserSidebar);
router.get("/:id", isLoggedin, getMessage);
router.post("/send/:id", isLoggedin, sendMessage);

export default router;