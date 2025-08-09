import express from "express";
import authmiddleware from "../user/userMiddleware.js";
import { changeVaultName, createWallet, getAllUserWalletAddress, getAttestation, getParticularPayment, getSpecificWallet, getTransactions, getUserPaymentsHistory, getWalletBalance, handleCrossChain, mint, postPaymentInfo, sendTransaction } from "./circleController.js";

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
circleRouter.get("/get-payment-info/:id", getParticularPayment);
circleRouter.get("/get/all-payment/:address", getUserPaymentsHistory);
circleRouter.post("/cross-chain-transfer", handleCrossChain);
circleRouter.get("/cross-chain-Attes/:txHash", getAttestation);
circleRouter.post("/cross-chain-mint", mint);

export default circleRouter;


/* 

{
      "walletId" : "7465e3a3-baa4-512f-b25c-c5ff3c0342e4",
      "burnAmount" : 3000000,
      "destDomain" :1,
      "destAddress" : "0xee26134dfd3f8a19cad9273f82b5873de462c511",
      "usdcContract" : "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
      "tkMess" : "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
      "msgTrans": "0xa9fB1b3009DCb79E2fe346c16a604B8Fa8aE0a79" 
}*/