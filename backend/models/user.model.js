import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            maxLength: [100, 'username must have max 100 characters, got {VALUE}']
        },

        fullName: {
            type: String,
            required: true,
            trim: true,
            maxLength:[80, 'fullName must have max 80 characters, got {VALUE}']
        },

        password: {
            type: String,
            required: true,
            trim: true,
            minLength: [6, 'Must be at least 6, got {VALUE}'],
        },

        email: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },

        followers: [
            { type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] },
        ],

        following: [
            { type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] },
        ],

        profileImg: {
            type: String,
            default: "",
        },

        coverImg: {
            type: String,
            default: "",
        },

        bio: {
            type: String,
            default: "",
        },

        link: {
            type: String,
            default: "",
        },
    },
    { timestamps: true },
);

const User = mongoose.model("User", userSchema);

export default User;
