import express from "express";
import {
    getAuthUser,
    login,
    logout,
    signup,
} from "../controllers/auth.controller.js";
import protectedRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/user", protectedRoute, getAuthUser);

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

export default router;
