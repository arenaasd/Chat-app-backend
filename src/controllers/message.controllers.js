import UserModel from "../models/user.model.js";
import MessageModel from "../models/message.model.js";
import cloudinary from "../config/cloudinary.cn.js";
import { getReceiverSocketId, io } from "../config/socket.js";



export const getuserSidebar = async (req, res) => {
    try {
        const LoggedinUserId = req.user._id;
        const filteredUsers = await UserModel.find({ _id: { $ne: LoggedinUserId } }).select("-password");

        res.status(200).json(filteredUsers);
    } catch (error) {
        console.log("something is wrong in getuserSiderbar Controller", error.message);
        res.status(500).json({ message: "Something went wrong" });
    }
}


export const getMessage = async (req, res) => {
    try {
        const { id: UsertoChatId } = req.params;
        const myId = req.user._id;

        const Messages = await MessageModel.find({
            $or: [
                { senderId: myId, recieverId: UsertoChatId },
                { senderId: UsertoChatId, recieverId: myId }
            ]
        })
        res.status(200).json(Messages);
    } catch (error) {
        console.log("something is wrong in getMessages Controller", error.message);
        res.status(500).json({ message: "Something went wrong" });
    }
};


export const sendMessage = async (req, res) => {
    try {
        const { image, text } = req.body;
        const { id: recieverId } = req.params;
        const senderId = req.user._id;

        let ImageUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image)
            ImageUrl = uploadResponse.secure_url;
        }

        const newMessage = await MessageModel.create({
            senderId,
            recieverId,
            text,
            image: ImageUrl
        });

        await newMessage.save()

        const recieverSocketId = getReceiverSocketId(recieverId);
        if(recieverSocketId) {
            io.to(recieverSocketId).emit("newMessage", newMessage)
        }

        res.status(201).json(newMessage);

    } catch (error) {
        console.log("something is wrong in sendMessage Controller", error.message);
        res.status(500).json({ message: "Something went wrong" });
    }
};