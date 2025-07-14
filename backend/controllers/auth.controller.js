import User from "../models/user.model.js";
import { generateTokenAndSetCookie, validEmail } from "../utils/helper.js";
import bcrypt from "bcrypt";

export const signup = async (req, res) => {
    try {
        const { fullName, username, email, password } = req.body;

        const isValidEmail = validEmail(email);
        if (!isValidEmail) {
            return res.status(400).json({
                success: false,
                error: "Invalid email format",
            });
        }

        const existingUser = await User.findOne({ username });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                error: "username is already taken",
            });
        }

        const existingEmail = await User.findOne({ email });

        if (existingEmail) {
            return res.status(400).json({
                success: false,
                error: "This email is already is in use",
            });
        }

        if(password.length < 6){
             return res.status(400).json({
                success: false,
                error: "Password must be at least 6 character long",
            });
        }
        // if all checks passes, now hash the password using bcrypt

        const saltRounds = 10;

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = new User({
            fullName,
            email,
            username,
            password: hashedPassword,
        });

        // once user is created generate a jwt token and send it back to the cookie

        if (newUser) {
            generateTokenAndSetCookie(newUser._id, res);
            await newUser.save();
            res.status(201).json({
                success: true,
                data: {
                    _id: newUser._id,
                    fullName: newUser.fullName,
                    email: newUser.email,
                    username: newUser.username,
                    followers: newUser.followers,
                    following: newUser.following,
                    profileImg: newUser.profileImg,
                    coverImg: newUser.coverImg,
                },
            });
        } else {
            res.status(400).json({
                success: false,
                error: "Failed to create User",
            });
        }
    } catch (error) {
        console.error(`Error in signup Controller ${error.message}`);
        res.status(500).json({
            success: false,
            message: "Internal server Error",
        });
    }
};

export const login = async (req, res) => {
    res.json({
        data: "you hit the signup end point",
    });
};

export const logout = async (req, res) => {
    res.json({
        data: "you hit the signup end point",
    });
};
