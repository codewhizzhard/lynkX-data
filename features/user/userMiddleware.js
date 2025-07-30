//const jwt = require("jsonwebtoken")
import jwt from "jsonwebtoken";

const authmiddleware = async(req, res, next) => {
     let authHeaders = req.headers.authorization 

     if (authHeaders && authHeaders.startsWith("Bearer")) {
        const token = authHeaders.split(" ")[1];
        jwt.verify(token, process.env.SECRET, (err, decoded) => {
            if(err) {
                res.status(401).json({message: "user not authorized"})
            }
            req.user = decoded?.user;
            next();
        })
        
     } else {
        return res.status(400).json({message: "Token not found"})
     }

}

/* module.exports = authmiddleware */
export default authmiddleware;