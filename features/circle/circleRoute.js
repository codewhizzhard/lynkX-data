import express from "express";
import authmiddleware from "../user/userMiddleware.js";
import { changeVaultName, createWallet, getAllUserWalletAddress, getSpecificWallet, getTransactions, getWalletBalance, postPaymentInfo, sendTransaction } from "./circleController.js";

const circleRouter = express.Router();

circleRouter.use(authmiddleware)

circleRouter.post("/create-wallets", createWallet);
circleRouter.get("/getUserAddresses/:address", getAllUserWalletAddress);
circleRouter.get("/getSpecificAddress/:address/:id", getSpecificWallet);
circleRouter.get("/get-wallet-address/:id", getWalletBalance);
circleRouter.post("/send-transaction", sendTransaction);
circleRouter.get("/get-transactions", getTransactions);
circleRouter.post("/change-vaultName", changeVaultName);
circleRouter.post("/post-payment-info", postPaymentInfo);

export default circleRouter;