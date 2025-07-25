import express from "express";
import authmiddleware from "../user/userMiddleware.js";
import { createWallet } from "./circleController.js";

const circleRouter = express.Router();

circleRouter.use(authmiddleware)

circleRouter.post("/create-wallets", createWallet);

export default circleRouter;