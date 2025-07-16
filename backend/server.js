import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

// config and utils
import { cloudinaryConfig } from "./config/cloudinary.js";
import connectToDB from "./db/connectToMongoDB.js";

// routes
import authRoute from "./routes/auth.route.js";
import userRoute from "./routes/user.route.js";
import postRoute from "./routes/post.route.js";
import notificationRoute from "./routes/notification.route.js";

dotenv.config();

cloudinaryConfig();
const app = express();

const port = process.env.PORT || 4000;

app.use(express.json()); // To parse the req.body
app.use(express.urlencoded({ extended: true })); // to parse the form data(urlencoded)

app.use(cookieParser()); // To parse the cookie data

app.use("/api/auth", authRoute);

app.use("/api/users", userRoute);

app.use("/api/posts", postRoute);

app.use("/api/notifications", notificationRoute);

connectToDB(() => {
    app.listen(port, () => {
        console.log(`server is running on http://localhost:${port}/`);
    });
});
