import { v2 as cloudinary } from "cloudinary";

// models
import Post from "../models/post.model.js";
import User from "../models/user.model.js";

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
