//const User = require("./model/userDetails");
import dotenv from "dotenv";
dotenv.config();
import User from "./model/userDetails.js";
/* const jwt = require("jsonwebtoken") */
import jwt from "jsonwebtoken";
import { generateEntitySecret } from '@circle-fin/developer-controlled-wallets';
import { registerEntitySecretCiphertext } from '@circle-fin/developer-controlled-wallets'
import { initiateDeveloperControlledWalletsClient } from '@circle-fin/developer-controlled-wallets'

import { verifyMessage, getAddress } from 'viem';




const findOrCreateUser = async (address) => {
    
    
    let user = await User.findOne({address});
    if (user) {
       user.lastLogin = new Date();
       await user.save();
    } else {
     user = await User.create({
        address: address.toLowerCase(),
        lastLogin: new Date()
    })
}
    return user
}

const login = async (req, res) => {
    const {address, message, signature} = req.body;
    console.log("req.body:", req.body)
    if (!address || !message || !signature) return res.status(400).json({message: "No data sent"})

    const checksumAddress = getAddress(address);

    const userValid = await verifyMessage({
        address: checksumAddress, message, signature
    })

    if (!userValid) {
       return  res.status(401).json({message: "user not signed in"})
    }
    const user = await findOrCreateUser(checksumAddress);
   
    const token = jwt.sign({
        user: {
            address: user.address,
            userId: user._id
        }
    }, process.env.SECRET, {expiresIn: "7d"});

    return res.status(200).json({
        message: "login successful",
        data: {user, token}
    })

}

const changeProfile = async (req, res) => {
    const {address, username, about} = req.body;
    try {
         if (!address || (!username && !about)) {
            return res.status(400).json({message: "No data is passed"});
        }
        const checksumAddress = getAddress(address)
        const user = await User.findOneAndUpdate({address: checksumAddress}, {username, about}, {new: true, runValidators: true})
        //console.log("user:", user)
        if (!user) return res.status(400).json({message: "This User has not being registered"})
        return res.status(200).json({data: user})
        } catch (err) {
            console.log("error:", err)
        }
   
}
const changeProfileImage = async (req, res) => {
  const { address, profilePicture } = req.body;

  if (!address || !profilePicture) {
    return res.status(400).json({ message: "Address and profilePicture are required" });
  }

  try {
    const checksumAddress = getAddress(address);

    const user = await User.findOneAndUpdate(
      { address: checksumAddress },
      { profilePicture },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(400).json({ message: "User not registered" });
    }

    return res.status(200).json({ data: user });
  } catch (err) {
    console.error("Error updating profile picture:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
//
const getUserDetails = async (req, res) => {
    try {
        const {address} = req.params;
    console.log("add", address);
    const checksumAddress = getAddress(address)
    const user = await User.findOne({address: checksumAddress})
    if (!user) return res.status(400).json({message: "User not registered"})
    return res.status(200).json({message: "User details successfully fetched", data: user});

    } catch (err) {
        console.log("err:", err)
    }
    
}

const addWorkspace = async(req, res) => {
    const {address, workspace} = req.body
    if (!address || !workspace) return res.status(400).json({message: "Required all fields to continue"})
    const checksumAddress = getAddress(address)
    try {
    const user = await User.findOneAndUpdate({address: checksumAddress}, { $addToSet: { workspace: workspace } }, { new: true, runValidators: true })
    if (!user) return res.status(404).json({message: "user not found"})
    return res.status(200).json({message: "workspace added successfully", data: user})
} catch (err) {
    return res.status(500).json({ERROR: err})
}
}


//module.exports = {login}
export { login, changeProfile, getUserDetails, changeProfileImage, addWorkspace };