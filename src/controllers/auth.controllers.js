import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generatetoken.js";
import cloudinary from "../config/cloudinary.cn.js"

export const signin = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        if (!name || !email || !password) {
            return res.status(400).json({ msg: 'All fields are required' })
        }

        if (password.length < 6) { return res.status(400).json({ msg: 'Password at least must be 6 characters' }) }

        const user = await userModel.findOne({ email });
        if (user) { return res.status(400).json({ msg: 'User already exist' }) }

        const salt = await bcrypt.genSalt(10)

        const hashedpassword = await bcrypt.hash(password, salt)


        const newUser = await userModel.create({
            name,
            email,
            password: hashedpassword
        })
        if (newUser) {
            generateToken(newUser._id, res)
            return res.status(201).json({ msg: 'User Created Successfully' })
        } else {
            return res.status(400).json({ msg: 'Invalid User Credentials' })
        }
    } catch (error) {
        console.log("something is wrong on signin auth controller", error.message);
        return res.status(500).json({ msg: "Something Went Wrong" })
    }
}


export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email }).select("+password"); // <-- Explicitly include password
        if (!user) {
            return res.status(400).json({ msg: "Email or Password is Incorrect" });
        }

        const correctedpass = await bcrypt.compare(password, user.password);
        if (!correctedpass) {
            return res.status(400).json({ msg: "Email or Password is Incorrect" });
        }

        generateToken(user._id, res);
        res.status(200).json({ msg: "Logged in Successfully" });
    } catch (error) {
        console.log("something is wrong on login auth controller", error.message);
        return res.status(500).json({ msg: "Something Went Wrong" });
    }
};



export const logout = async (req, res) => {
    try {
        res.cookie("token", "", {maxAge: 0})
        res.status(200).json({msg:"Logged out Successfully"});
    } catch (error) {
        console.log("something is wrong on logout auth controller", error.message);
        return res.status(400).json({ msg: "Something Went Wrong" })
    }

};

export const updateProfile = async (req, res) => {
    try {
      const { profilePic } = req.body;
      const userId = req.user._id;
  
      if (!profilePic) {
        return res.status(400).json({ message: "Profile pic is required" });
      }
  
      const uploadResponse = await cloudinary.uploader.upload(profilePic);
      const updatedUser = await userModel.findByIdAndUpdate(
        userId,
        { profilePic: uploadResponse.secure_url },
        { new: true }
      );
  
      res.status(200).json(updatedUser);
    } catch (error) {
      console.log("error in update profile:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

 


export const checkAuth = async (req, res) => {
    try {

        if (!req.user) {
            return res.status(401).json({ msg: "Unauthorized - No Token Data" });
        }

        const user = await userModel.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        console.log("Error in checkAuth:", error);
        res.status(500).json({ msg: "Something Went Wrong" });
    }
};
