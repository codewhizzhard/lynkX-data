import express from "express";

const router = express.Router();

import {login, changeProfile, getUserDetails} from "./userController.js";
import authmiddleware from "./userMiddleware.js";

router.post("/auth", login);




//authmiddleware// authMiddleware for protected route

router.use(authmiddleware);
router.post("/changeProfile", changeProfile);
router.get("/getUserDetails/:address", getUserDetails);

export default router;