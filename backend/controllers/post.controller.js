import { v2 as cloudinary } from "cloudinary";

// models
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";

export const createPost = async (req, res) => {
    const { text } = req.body;
    let { img } = req.body;
    const userId = req.user._id.toString();
    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: "User not found",
            });
        }

        if (!text && !img) {
            return res.status(400).json({
                success: false,
                error: "Post must have text or image",
            });
        }

        if (img) {
            const uploadedResult = await cloudinary.uploader.upload(img);
            img = uploadedResult.secure_url;
        }

        const newPost = new Post({
            user: userId,
            text,
            img,
        });

        await newPost.save();
        return res.status(201).json({
            success: true,
            data: newPost,
        });
    } catch (error) {
        console.error(`Error in createPost controller ${error.message}`);
        res.status(500).json({
            success: false,
            error: "Internal Server Error",
        });
    }
};

export const deletePost = async (req, res) => {
    const postId = req.params.id;
    try {
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                success: false,
                error: "Post not found",
            });
        }
        // check if the the owner of the post wants to delete the post

        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({
                success: false,
                error: "You are not authorized to delete this post",
            });
        }

        // if post has image, so delete it from the cloudinary also

        if (post.img) {
            const imgId = post.img.split("/").pop().split(".")[0]; // check update post controller to see what it does

            await cloudinary.uploader.destroy(imgId);
        }

        await Post.findByIdAndDelete(postId);
        return res.status(200).json({
            success: true,
            message: "Post has been deleted successfully",
        });
    } catch (error) {
        console.error(`Error in deletePost controller ${error.message}`);
        res.status(500).json({
            success: false,
            error: "Internal Server Error",
        });
    }
};

export const commentOnPost = async (req, res) => {
    const { text } = req.body;

    const postId = req.params.id;
    const userId = req.user._id;
    try {
        if (!text) {
            return res.status(400).json({
                success: false,
                error: "Post text is required",
            });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                success: false,
                error: "Post not found",
            });
        }

        // create comment

        const comment = { user: userId, text };

        post.comments.push(comment);

        await post.save();

        return res.status(200).json({
            success: true,
            data: post,
        });
    } catch (error) {
        console.error(`Error in commentOnPost controller ${error.message}`);
        res.status(500).json({
            success: false,
            error: "Internal Server Error",
        });
    }
};

export const likeUnlikePost = async (req, res) => {
    //done with push and pull method from mongoose

    const postId = req.params.id;
    const userId = req.user._id;

    try {
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                success: false,
                error: "Post not found",
            });
        }

        const isUserAlreadyLikedPost = post.likes.includes(userId);

        if (isUserAlreadyLikedPost) {
            // unlike the post

            await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });

            // delete from the notification schema

            await Notification.deleteOne({
                from: userId,
                to: post.user,
                type: "like",
            });

            return res.status(200).json({
                success: true,
                message: "Post unlike successfully",
            });
        } else {
            // like the post

            await Post.updateOne({ _id: postId }, { $push: { likes: userId } });

            // send new notification

            const notification = new Notification({
                from: userId,
                to: post.user,
                type: "like",
            });

            await notification.save();

            res.status(200).json({
                success: true,
                message: "Post liked successfully",
            });
        }
    } catch (error) {
        console.error(`Error in likeUnlikePost controller ${error.message}`);
        res.status(500).json({
            success: false,
            error: "Internal Server Error",
        });
    }
};
