//const User = require("./model/userDetails");
import User from "./model/userDetails.js";
/* const jwt = require("jsonwebtoken") */
import jwt from "jsonwebtoken";

import { verifyMessage } from 'viem';

const findOrCreateUser = async (address) => {
    let user = await User.findOne({address: address.toLowerCase()});
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

    const userValid = await verifyMessage({
        address, message, signature
    })

    if (!userValid) {
        res.status(401).json({message: "user not signed in"})
    }
    const user = await findOrCreateUser(address);
   
    const token = jwt.sign({
        user: {
            address: user.address,
            userId: user._id
        }
    }, process.env.SECRET, {expiresIn: "7d"});

    res.status(200).json({
        message: "login successful",
        data: {
            address: user.address,
            lastLogin: user.lastLogin,
            userToken: token
        }
    })

}

//module.exports = {login}
export { login };