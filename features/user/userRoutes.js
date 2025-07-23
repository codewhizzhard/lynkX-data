import express from "express";

const router = express.Router();

import {login} from "./userController.js";
import authmiddleware from "./userMiddleware.js";

router.post("/auth", login);

//authmiddleware// authMiddleware for protected route

export default router;