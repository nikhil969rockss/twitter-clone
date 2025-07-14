import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const protectedRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwtToken;
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized You need to login first",
            });
        }

        const decoded = await jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(400).json({
                success: false,
                message: "Unauthorized Invalid token",
            });
        }

        // if we get the token we find the user in the db with id inside the token

        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Could not find this user",
            });
        }

        req.user = user;

        next();
    } catch (error) {
        console.error(`Error in protectedRoute middleware ${error.message}`);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export default protectedRoute;
