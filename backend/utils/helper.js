import jwt from "jsonwebtoken";

export const validEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(email);
};

export const generateTokenAndSetCookie = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "10d",
    });

    res.cookie("jwtToken", token, {
        maxAge: 1000 * 60 * 60 * 24 * 10, // 10 days
        httpOnly: true, // prevent XSS attacks cross site scripting attacks
        sameSite: "strict", // CSRF attacks cross-site request forgery attacks
        secure: process.env.NODE_ENV !== "development",
    });
};
