//const mongoose = require("mongoose");
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({

    address: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    lastLogin: {
        type: Date,
        default: Date.now
    },
    role: {
        type: String,
        enum: ["merchant", "liquidity-provider", "treasury-manager"],
        default: "merchant"
    },
    username: {
        type: String,
        default: "USER",
    },
    about: {
        type: String,
    },
    wallets: {
        type: [mongoose.Schema.Types.Mixed],
        default: []
    }, 
    profilePicture: {
        type: String,
    },
    workspace: {
        type: [String],
        default: []
    }

}, {
    timestamps: true
})
////unique: true,

const User = mongoose.model("User", UserSchema);
export default User;