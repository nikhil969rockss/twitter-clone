import express from "express";
import protectedRoute from "../middleware/protectRoute.js";
import {
    commentOnPost,
    createPost,
    deletePost,
    getAllPost,
    getFollowingPost,
    getLikedPosts,
    getUserPosts,
    likeUnlikePost,
} from "../controllers/post.controller.js";

const router = express.Router();

router.get("/all", protectedRoute, getAllPost);

router.get("/following", protectedRoute, getFollowingPost);

router.get("/user/:username", protectedRoute, getUserPosts);

router.get("/likes/:id", protectedRoute, getLikedPosts);

router.post("/create", protectedRoute, createPost);

router.post("/like/:id", protectedRoute, likeUnlikePost);

router.post("/comment/:id", protectedRoute, commentOnPost);

router.post("/:id", protectedRoute, deletePost);

export default router;
