import express from "express";
import protectedRoute from "../middleware/protectRoute.js";
import {
    deleteNotifications,
    getNotifications,
} from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/", protectedRoute, getNotifications);

router.delete("/", protectedRoute, deleteNotifications);

//optional route

// router.delete("/:id", protectedRoute, deleteOneNotification);

export default router;
