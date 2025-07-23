//const mongoose = require("mongoose");
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({

    address: {
        type: String,
        required: true,
        lowercase: true
    },
    lastLogin: {
        type: Date,
        default: Date.now
    },
    role: {
        type: String,
        enum: ["merchant", "liquidityProvider", "treasuryManager"],
        default: "merchant"
    },
    username: {
        type: String,
        default: "USER",
    },

}, {
    timestamps: true
})
////unique: true,

const User = mongoose.model("User", UserSchema);
export default User;