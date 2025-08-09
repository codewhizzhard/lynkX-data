import express from "express";

const router = express.Router();

import {login, changeProfile, getUserDetails, changeProfileImage, addWorkspace} from "./userController.js";
import authmiddleware from "./userMiddleware.js";

router.post("/auth", login);




//authmiddleware// authMiddleware for protected route

router.use(authmiddleware);
router.post("/changeProfile", changeProfile);
router.post("/changeProfileImage", changeProfileImage);
router.post("/addWorkspace", addWorkspace);
router.get("/getUserDetails/:address", getUserDetails);

export default router;