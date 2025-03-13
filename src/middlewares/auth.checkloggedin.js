import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js"

const isLoggedin = async (req, res, next) => {
    try {
        const token = req.cookies?.token;
        if (!token) return res.status(401).json({ message: "Unauthorized - No Token Provided" })

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) return res.status(401).json({ message: "Invalid Token" });

        const user = await userModel.findById(decoded.userId).select("-password")

        if (!user) {
            return res.status(401).json({ message: "No User Found" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.log("Something is wrong in isLoggedin middleware:", error);
        res.status(401).json({ message: "Authentication failed" });
    }
}

export default isLoggedin;
