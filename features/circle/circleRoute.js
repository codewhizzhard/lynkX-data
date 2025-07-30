import express from "express";
import authmiddleware from "../user/userMiddleware.js";
import { createWallet, getAllUserWalletAddress, getSpecificWallet, getTransactions, getWalletBalance, sendTransaction } from "./circleController.js";

const circleRouter = express.Router();

circleRouter.use(authmiddleware)

circleRouter.post("/create-wallets", createWallet);
circleRouter.get("/getUserAddresses/:address", getAllUserWalletAddress);
circleRouter.get("/getSpecificAddress/:address/:id", getSpecificWallet);
circleRouter.get("/get-wallet-address/:id", getWalletBalance);
circleRouter.post("/send-transaction", sendTransaction);
circleRouter.post("/get-transactions", getTransactions);

export default circleRouter;