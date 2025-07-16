import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";

//models
import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";

// this will hit the route when we see the user Profile page. eg: Name, member since and etc
export const getUserProfile = async (req, res) => {
    const { username } = req.params;
    try {
        const user = await User.findOne({ username }).select("-password");
        if (!user) {
            return res.status(404).json({
                success: false,
                error: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        console.error(`Error in getUserProfile controller ${error.message}`);
        res.status(500).json({
            success: false,
            error: "Internal Server Error",
        });
    }
};

export const followUnfollowUser = async (req, res) => {
    const { id } = req.params;

    //console.log(id===req.user._id.toString());// req.user._id --> new object id('')

    try {
        const userToModify = await User.findById(id);
        const currentUser = await User.findById(req.user._id);

        // you cannot follow/unfollow yourself

        if (id === req.user._id.toString()) {
            return res.status(400).json({
                success: false,
                error: "You can not follow/unfollow yourself",
            });
        }

        if (!userToModify || !currentUser) {
            return res.status(404).json({
                success: false,
                error: "User not found",
            });
        }

        // checks if the user is following

        const isFollowing = currentUser.following.includes(id);

        if (isFollowing) {
            //unfollow the user

            await User.findByIdAndUpdate(id, {
                $pull: { followers: req.user._id },
            });
            await User.findByIdAndUpdate(req.user._id, {
                $pull: { following: id },
            });

            // delete it from the notification model

            await Notification.deleteOne({
                from: req.user._id,
                to: userToModify._id,
                type: "follow",
            });

            //TODO: return the id to the user as a response

            res.status(200).json({
                success: true,
                message: "User unfollowed successfully",
            });
        } else {
            //follow the user

            await User.findByIdAndUpdate(id, {
                $push: { followers: req.user._id },
            });
            await User.findByIdAndUpdate(req.user._id, {
                $push: { following: id },
            });

            // send the notification to the user

            const newNotification = new Notification({
                type: "follow",
                from: req.user._id,
                to: userToModify._id,
            });
            await newNotification.save();

            //TODO: return the id to the user as a response

            res.status(200).json({
                success: true,
                message: "User followed successfully",
            });
        }
    } catch (error) {
        console.error(
            `Error in followUnfollowUser controller ${error.message}`,
        );
        res.status(500).json({
            success: false,
            error: "Internal Server Error",
        });
    }
};

export const getSuggestedUser = async (req, res) => {
    try {
        const userId = req.user._id;

        const currentUserFollowing = await User.findById(userId).select(
            "following",
        );

        const followingIds = currentUserFollowing.following || [];

        const users = await User.aggregate([
            {
                $match: {
                    _id: { $nin: [...followingIds, userId] }, // exclude following and self
                },
            },
            {
                $sample: { size: 10 },
            },
            {
                $project: {
                    password: 0,
                    email: 0,
                    __v: 0,
                }, // can include whatever private field to exclude
            },
        ]);

        const suggestedUsers = users.slice(0, 4);

        res.status(200).json({
            success: true,
            data: suggestedUsers,
        });
    } catch (error) {
        console.error(`Error in getSuggestedUser controller ${error.message}`);
        res.status(500).json({
            success: false,
            error: "Internal Server Error",
        });
    }
};

export const updateUser = async (req, res) => {
    const {
        fullName,
        email,
        username,
        bio,
        link,
        currentPassword,
        newPassword,
    } = req.body;

    let { profileImg, coverImg } = req.body;
    const userId = req.user._id;
    try {
        let user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: "User not found",
            });
        }

        if (
            (!currentPassword && newPassword) ||
            (currentPassword && !newPassword)
        ) {
            return res.status(400).json({
                success: false,
                error: "please provide both Current Password and New Password",
            });
        }

        if (currentPassword && newPassword) {
            // check if the current password is valid

            const isMatch = await bcrypt.compare(
                currentPassword,
                user.password,
            );

            if (!isMatch) {
                return res.status(400).json({
                    success: false,
                    error: "Current Password is invalid, Please check your password",
                });
            }
            if (newPassword.length < 6) {
                return res.status(400).json({
                    success: false,
                    error: "Password must be at least 6 character long",
                });
            }
            // if matched, hash the new password
            const saltRounds = 10;

            user.password = await bcrypt.hash(newPassword, saltRounds);
        }

        if (profileImg) {
            if (user.profileImg) {
                // delete the previous one so that storage not get full
                //https://res.cloudinary.com/dyfqon1v6/image/upload/v1712997552/zmxorcxexpdbh8r0bkjb.png

                // we need zmxorcxexpdbh8r0bkjb

                const imageId = profileImg.split("/").pop().split(".")[0];

                await cloudinary.uploader.destroy(imageId);
            }

            const uploadedResult = await cloudinary.uploader.upload(profileImg);
            profileImg = uploadedResult.secure_url;
        }
        if (coverImg) {
            if (user.coverImg) {
                // delete the previous one so that storage not get full
                //https://res.cloudinary.com/dyfqon1v6/image/upload/v1712997552/zmxorcxexpdbh8r0bkjb.png

                // we need zmxorcxexpdbh8r0bkjb

                const imageId = coverImg.split("/").pop().split(".")[0];

                await cloudinary.uploader.destroy(imageId);
            }

            const uploadedResult = await cloudinary.uploader.upload(coverImg);
            coverImg = uploadedResult.secure_url;
        }

        user.fullName = fullName || user.fullName;
        user.email = email || user.email;
        user.username = username || user.username;
        user.bio = bio || user.bio;
        user.link = link || user.link;
        user.profileImg = profileImg || user.profileImg;
        user.coverImg = coverImg || user.coverImg;

        await user.save();

        // password should be null in response
        user.password = null;

        return res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        console.error(`Error in updateUser controller ${error.message}`);
        res.status(500).json({
            success: false,
            error: "Internal Server Error",
        });
    }
};
