import express from "express";
import authmiddleware from "../user/userMiddleware.js";
import { changeVaultName, createWallet, getAllUserWalletAddress, getParticularPayment, getSpecificWallet, getTransactions, getUserPaymentsHistory, getWalletBalance, handleCrossChain, mint, postPaymentInfo, sendTransaction } from "./circleController.js";

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
//circleRouter.get("/cross-chain-Attes/:txHash", getAttestation);
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

/*    


const handleCrossChain = async (req, res) => {
  const {
    walletId,
    sourceChain,
    destinationChain,
    amount,
    recipientAddress
  } = req.body;

  // Contract addresses
  const CONTRACTS = {
    ethereumSepolia: {
      usdc: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
      tokenMessenger: "0x8FE6B999Dc680CcFDD5Bf7EB0974218be2542DAA"
    },
    avalanche: {
      usdc: "0x5425890298aed601595a70AB815c96711a31Bc65", 
      tokenMessenger: "0x6B25532e1060CE10cc3B0A99e5683b91BFDe6982"
    },
    arbitrum: {
      usdc: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
      tokenMessenger: "0x19330d10D9Cc8751218eaf51E8885D058642E08A"
    }
  };

  // Chain domain mappings
  const CHAIN_DOMAINS = {
    ethereumSepolia: 0,
    avalanche: 1, 
    arbitrum: 3
  };

  // Helper function to wait for transaction
  const waitForTransaction = async (transactionId) => {
    const maxAttempts = 60;
    let attempts = 0;
    
    while (attempts < maxAttempts) {
      try {
        const txStatus = await client.getTransaction({ id: transactionId });
        
        if (txStatus.data.state === 'COMPLETE') {
          console.log("ok:", txStatus.data);
          return txStatus.data;
        }
        
        if (txStatus.data.state === 'FAILED') {
          throw new Error('Transaction failed');
        }
        
        await new Promise(resolve => setTimeout(resolve, 5000));
        attempts++;
      } catch (error) {
        console.error('Transaction status check failed:', error);
        attempts++;
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
    
    throw new Error('Transaction confirmation timeout');
  };

  // Helper function to wait for attestation
  const waitForAttestation = async (burnTxHash) => {
    console.log('Waiting for attestation...');
    const maxAttempts = 60;
    let attempts = 0;

    while (attempts < maxAttempts) {
      try {
        const response = await fetch(`https://iris-api.circle.com/attestations/${burnTxHash}`);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.status === 'complete') {
          console.log('Attestation received');
          return {
            message: data.message,
            attestation: data.attestation
          };
        }
        
        console.log(`Attestation attempt ${attempts + 1}/${maxAttempts} - Status: ${data.status}`);
        
        await new Promise(resolve => setTimeout(resolve, 10000));
        attempts++;
      } catch (error) {
        console.error(`Attestation check failed (attempt ${attempts + 1}):`, error.message);
        attempts++;
        await new Promise(resolve => setTimeout(resolve, 10000));
      }
    }
    
    throw new Error('Attestation timeout - max attempts reached');
  };

  try {
    console.log('Starting CCTP transfer...');
    
    const sourceContracts = CONTRACTS[sourceChain];
    const destContracts = CONTRACTS[destinationChain];
    const destinationDomain = CHAIN_DOMAINS[destinationChain];
    const recipientBytes32 = "0x" + recipientAddress.slice(2).padStart(64, '0');

    // Step 1: Approve USDC
    console.log('Step 1: Approving USDC...');
    const approveResponse = await client.createContractExecutionTransaction({
      walletId: walletId,
      contractAddress: sourceContracts.usdc,
      abiFunctionSignature: "approve(address,uint256)",
      abiParameters: [
        sourceContracts.tokenMessenger,
        amount
      ],
      feeLevel: "MEDIUM",
      idempotencyKey: `approve-${Date.now()}-${Math.random()}`
    });

    console.log('Approve transaction:', approveResponse.data.transactionHash);
    await waitForTransaction(approveResponse.data.id);

    // Step 2: Burn USDC
    console.log('Step 2: Burning USDC...');
    const burnResponse = await client.createContractExecutionTransaction({
      walletId: walletId,
      contractAddress: sourceContracts.tokenMessenger,
      abiFunctionSignature: "depositForBurn(uint256,uint32,bytes32,address)",
      abiParameters: [
        amount,
        destinationDomain,
        recipientBytes32,
        sourceContracts.usdc
      ],
      feeLevel: "MEDIUM",
      idempotencyKey: `burn-${Date.now()}-${Math.random()}`
    });

    console.log('Burn transaction:', burnResponse.data.transactionHash);
    await waitForTransaction(burnResponse.data.id);

    // Step 3: Wait for attestation
    console.log('Step 3: Waiting for attestation...');
    const attestationData = await waitForAttestation(burnResponse.data.transactionHash);
    console.log("atesaa:", attestationData);

    // Step 4: Mint USDC
    console.log('Step 4: Minting USDC...');
    const mintResponse = await client.createContractExecutionTransaction({
      walletId: walletId,
      contractAddress: destContracts.tokenMessenger,
      abiFunctionSignature: "receiveMessage(bytes,bytes)",
      abiParameters: [
        attestationData.message,
        attestationData.attestation
      ],
      feeLevel: "MEDIUM",
      idempotencyKey: `mint-${Date.now()}-${Math.random()}`
    });

    console.log('Mint transaction:', mintResponse.data.transactionHash);
    await waitForTransaction(mintResponse.data.id);

    console.log('CCTP transfer completed successfully!');
    
    const result = {
      success: true,
      approveTxHash: approveResponse.data.transactionHash,
      burnTxHash: burnResponse.data.transactionHash,
      mintTxHash: mintResponse.data.transactionHash,
      status: 'completed'
    };
    
    console.log("gooD:", result);
    
    // Send response if this is an Express route
    if (res) {
      res.json(result);
    }
    
    return result;
    
  } catch (error) {
    console.error('CCTP transfer failed:', error);
    
    const errorResult = {
      success: false,
      error: error.message
    };
    
    // Send error response if this is an Express route
    if (res) {
      res.status(500).json(errorResult);
    }
    
    return errorResult;
  }
};

*/