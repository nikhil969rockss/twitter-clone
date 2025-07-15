import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

// config and utils
import { cloudinaryConfig } from "./config/cloudinary.js";
import connectToDB from "./db/connectToMongoDB.js";

// routes
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";

dotenv.config();

cloudinaryConfig();

const app = express();

const port = process.env.PORT || 4000;

app.use(express.json()); // To parse the req.body
app.use(express.urlencoded({ extended: true })); // to parse the form data(urlencoded)

app.use(cookieParser()); // To parse the cookie data

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

connectToDB(() => {
    app.listen(port, () => {
        console.log(`server is running on http://localhost:${port}/`);
    });
});
