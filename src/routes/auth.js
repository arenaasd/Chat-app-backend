import express from "express";
const router = express.Router();
import { signin , login, logout, updateProfile , checkAuth } from "../controllers/auth.controllers.js";
import isLoggedin from "../middlewares/auth.checkloggedin.js"

router.post('/signin', signin);
router.post('/login', login);
router.post('/logout', logout);
router.put('/update-profile', isLoggedin, updateProfile);
router.get('/check', isLoggedin, checkAuth);


export default router;