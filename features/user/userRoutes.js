import express from "express";

const router = express.Router();

import {login, changeProfile} from "./userController.js";
import authmiddleware from "./userMiddleware.js";

router.post("/auth", login);

router.post("/ping", (req, res) => {
  console.log("Ping body:", req.body);
  res.json({ got: req.body });
});


//authmiddleware// authMiddleware for protected route

router.use(authmiddleware);
router.post("/changeProfile", changeProfile);

export default router;