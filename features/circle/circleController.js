import dotenv from "dotenv";
dotenv.config();
import { generateEntitySecret } from '@circle-fin/developer-controlled-wallets';
import { registerEntitySecretCiphertext } from '@circle-fin/developer-controlled-wallets'
import { initiateDeveloperControlledWalletsClient  } from '@circle-fin/developer-controlled-wallets'
import { getAddress, parseUnits } from "viem";
import User from "../user/model/userDetails.js";
import Payments from "./model/paymentDetail.js";
import { v4 as uuidv4 } from "uuid";
import mongoose from "mongoose";
import Web3 from "web3";
import { getMsgAndAttes } from "./cctpv2/cctpv2Controller.js";
import https from "https";
import { circleContracts, RPC_URLS, USDC_CONTRACTS } from "./cctpv2/circleContracts.js";



const agent = new https.Agent({ keepAlive: false,  maxCachedSessions: 0,  minVersion: 'TLSv1.2',
  maxVersion: 'TLSv1.3', });

const client = initiateDeveloperControlledWalletsClient ({
  apiKey: process.env.CIRCLE_API_KEY,
  entitySecret: process.env.ENTITY_SECRET,
  httpAgent: agent,
});





const createWallet = async (req, res) => {
    try {
        const { address, blockchains, walletName} = req.body;
        if (!address) return res.status(400).json({message: "address is required"})
        const checksumAddress = getAddress(address)
        if (!checksumAddress || !Array.isArray(blockchains) || blockchains.length === 0 || !walletName) {
            return res.status(400).json({message: "All fields are required to create a wallet"});
        }//
        let user = await User.findOne({address: checksumAddress})
        if (!user) return res.status(400).json({message: "user not found"});
        //console.log("user:", user);
        const rolesMap = {
            merchant: 4,
            liquidityProvider: 7,
            treasuryManager: 7
        };
        console.log("role:", user.role)
        const limit = rolesMap[user.role];
        //if (user.wallets && user.wallets.length > 0) return res.status(200).json({message: "Wallet already created", user});
        if (user.wallets.length >= limit ) return res.status(400).json({message: "You have reached the maximum number of wallets you can create"})
       
        const walletsResponse = await client.createWallets({
        accountType: "SCA",
        blockchains,
        count: 1,
        walletSetId: process.env.WALLET_SET_ID,
        })
        
        const wallet = walletsResponse?.data?.wallets.map((wallet) => ({...wallet, walletName,   isGasAsUsdc: false}))
        user.wallets = [...(user.wallets || []), ...wallet];
        await user.save();
         //console.log('Created Wallets', walletsResponse?.data?.wallets.map((wallet) => ({...wallet, name: "just"})))
        
        return res.status(201).json({message: "wallet succesfully created", user})
        //console.log("user", {...user.toObject(), wallets: walletsResponse.data?.wallets})
        //if (walletSetResponse) return res.status(201).json({})
        //
    } catch (err) {
        console.log("err:", err)
    }

   
}

 const getAllUserWalletAddress = async(req, res) => {
        try {
            const {address} = req.params;
            const checksumAddress = getAddress(address)
            if (!checksumAddress) return res.status(400).json({message: "required a valid address"})
            const user = await User.findOne({address: checksumAddress});
            return res.status(200).json({message: "wallets fetched successfully", wallets: user?.wallets})
            //console.log("user", user)
        } catch (err) {
            console.log("err:", err)
        }
}

const getSpecificWallet = async (req, res) => {
    try {
        const {address, id} = req.params
        const checksumAddress = getAddress(address);
        if (!checksumAddress || !id) return res.status(401).json({message: "Required fields to filter out data"});
        const user = await User.findOne({address: checksumAddress})
        if (!user) return res.status(400).json({message: "User not found"});
        const specificWallet = user.wallets.find((wallet) => id === wallet.id)
        if (!specificWallet) return res.status(401).json({message: "Wallet not found"});
        return res.status(200).json({message: "Wallet successfully fetched", specificWallet})
    } catch (err) {
        console.log("err:", err)
    }
}

const getWalletBalance = async (req, res) => {
    try {
        const { id} = req.params;
        if (!id) return res.status(400).json({message: "specify your request with the wallet id"});
        const response = await client.getWalletTokenBalance({
            id
        })
        if (!response) return res.status(401).json({message: "Wallet identity is not valid"});
        res.status(200).json({message: "Wallet balance successfully fetched", walletBalance: response.data?.tokenBalances})
        console.log("balance:", response.data?.tokenBalances)
    } catch (err) {
        console.log("err:", err);
        if (err) return res.status(401).json({message: err});
    }
    
}

const sendTransaction = async(req, res) => {
   const {amount, destinationAddress, tokenId, walletId, blockchain} = req.body;

    if (!amount || !destinationAddress || !tokenId || !walletId || !blockchain) {
        return res.status(400).json({message: "All fields are required to fulfill the transactions"})
    }
   try {
      const response = await client.validateAddress({
        address: destinationAddress.toLowerCase(),
        blockchain,
    });
     console.log(response.data?.isValid); 
     if (!response.data?.isValid) {
        return res.status(404).json({message: "address is not valid, check and try again"})
     }
      const send = await client.createTransaction({
        amount: [String(amount)],
        destinationAddress: destinationAddress.toLowerCase(),
        tokenId,
        walletId,
        fee: {
            type: 'level',
            config: {
            feeLevel: 'MEDIUM',
            },
        },
        })
        return res.status(201).json({message: "sent successfully", data: send?.data})

   } catch (err) {
    console.log("err:", err)
    res.json(err)

   }

}

const getTransactions = async (req, res) => {
    const ren = client.listWallets()
    console.log("ren:", ren)
    const response = await client.listTransactions()
    if (!response.data) return res.status(400).json({message: "getting transactions failed"})
    return res.status(200).json({message: 'successfully fetched transactions', data: response.data?.transactions})
    //console.log("res:", response.data?.transactions)
    //
}

const changeVaultName = async(req,res) => {
    try {
        const {address, vaultName, vaultAddress} = req.body; 
        if (!address || !vaultAddress) {
            return res.status(400).json({message: "All field must be filled"});
        }
        const checksumAddress = getAddress(address);
        const checkVaultAddress = getAddress(vaultAddress);
        if (!checksumAddress || !vaultName || !checkVaultAddress) {
            return res.status(400).json({message: "All field must be filled"});
        }
        //const user = await User.findOneAndUpdate({address: checksumAddress, "wallets.address": checkVaultAddress}, {$set: {"wallets.$.walletName": vaultName}}, {new: true})
         const result = await User.updateOne(
            { address: checksumAddress.toLowerCase(), "wallets.address": checkVaultAddress.toLowerCase() },
            { $set: { "wallets.$.walletName": vaultName } }
            );

            if (result.matchedCount === 0) {
            return res.status(404).json({ message: "Wallet not found" });
            }
            return res.json({ message: "Wallet name updated successfully" });
    } catch (err) {
        console.log("err:", err)
    }
}

const postPaymentInfo = async (req, res) => {
  try {
    const { userAddress, productName, orderId, amount, receiverAddress, blockchain, walletId } = req.body;
    const checksumAddress = getAddress(userAddress);

    if (amount == null || !receiverAddress || !checksumAddress || !blockchain || !walletId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const payment = await Payments.create({
        userAddress: checksumAddress,
        productName: productName || null,
        orderId: orderId || null,
        amount,
        receiverAddress,
        walletId,
        token: {
            chain: blockchain
        }
        });
        const paymentObj = payment.toObject();

        // Add custom field (if needed)
        paymentObj.paymentLink = `https://lynkx-ui.onrender.com/pay/${paymentObj._id}`; 
    return res.status(201).json({ message: "Payment created successfully", paymentObj});

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getParticularPayment = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({message: "invalid payment ID"})
    const payment = await Payments.findById(id);
    if (!payment) return res.status(400).json({message: "user has no payment details"})
    console.log("iiiii", payment)
    return res.status(200).json({message: "Payment details found successfully", payment})
}

const getUserPaymentsHistory = async (req, res) => {
    const { address } = req.params;
    if (!address) return res.status(400).json({message: "address required"})
    const checksumAddress = getAddress(address);
    const payments = await Payments.find({userAddress: checksumAddress});
    if (!payments) return res.status(400).json({message: "user has no payment history"})
    console.log("iiiii", payments)
    return res.status(200).json({message: "Payments history found successfully", payments})
}

// CCTPV2 INTEGRATION FOR DEVELOPER CONTROLLED WALLET

const mint = async (req, res) => {
  try {
    const { walletId, message, attestation, contractAddress } = req.body;
    if (!walletId || !message || !attestation || !contractAddress) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const response = await client.createContractExecutionTransaction({
      walletId,
      abiFunctionSignature: "receiveMessage(bytes,bytes)",
      abiParameters: [message, attestation],
      contractAddress,
      fee: { type: "level", config: { feeLevel: "MEDIUM" } }
    });
    //console.log("respon:", response)

    return res.status(200).json({message: "Funds successfully added", data: response.data});
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}; 




//mint
const minted = async ({walletId, message, attestation, contractAddress}) => {
  try {
    if (!walletId || !message || !attestation || !contractAddress) return 

    const response = await client.createContractExecutionTransaction({
      walletId,
      abiFunctionSignature: "receiveMessage(bytes,bytes)",
      abiParameters: [message, attestation],
      contractAddress,
      fee: { type: "level", config: { feeLevel: "MEDIUM" } }
    });
    console.log("respon:", response.data)


  } catch (err) {
   console.log("err:", err)
  }
}; 
/////

const handleCrossChain = async (req, res) => {
  const domain = {
  polygonAmoy: 7,
  ethereumSepolia: 0,
  baseSepolia: 6,
  avalancheFuji: 1
  }
  
  
  const {walletId, sourceChain, amount, destChain, destinationAddress, destWalletId} = req.body
  if (!walletId || !sourceChain || !amount || !destChain || !destinationAddress || !destWalletId) return res.status(400).json({message: "All fields required"})
    const web3 = new Web3(RPC_URLS[sourceChain]);

  function encodeAddressToBytes32(address) {
  // This returns a hex string padded as a Solidity address representation (32 bytes)
  return web3.eth.abi.encodeParameter('address', address);
}
  
  const amountInSmallestUnit = parseUnits(amount, 6).toString(); 

const tokenMessager = circleContracts["TokenMessengerV2"][sourceChain]
const messageTransminter = circleContracts["MessageTransmitterV2"][destChain]
const usdcAddress = USDC_CONTRACTS[sourceChain]
const encoded = encodeAddressToBytes32(destinationAddress);

try {
  
  // 1️⃣ Send approve transaction
const approveTx = await client.createContractExecutionTransaction({
  walletId: walletId,
  abiFunctionSignature: 'approve(address,uint256)',
  abiParameters: [tokenMessager, amountInSmallestUnit],
  contractAddress: usdcAddress,
  fee: {
    type: 'level',
    config: {
      feeLevel: 'MEDIUM'
    }
  }
});

const approveTxId = approveTx.data.id;
console.log(`✅ Approve transaction created. ID: ${approveTxId}`);

// 2️⃣ Wait for approve confirmation
let approveStatus = "PENDING";
while (approveStatus === "PENDING") {
  await new Promise((res) => setTimeout(res, 5000));
  const txStatus = await client.getTransaction({id: approveTxId});
  console.log("sta:", txStatus)
  approveStatus = txStatus.data.transaction.state;
  console.log(`🔄 Approval status: ${approveStatus}`);
}

if (approveStatus !== "SENT") {
  throw new Error(`Approval failed with status: ${approveStatus}`);
}

console.log("🎉 Approval confirmed on-chain!");

console.log("destchsain", domain[destChain])

const burn = await client.createContractExecutionTransaction({
  walletId: walletId,
  abiFunctionSignature: 'depositForBurn(uint256,uint32,bytes32,address)',
  abiParameters: [amountInSmallestUnit, domain[destChain], encoded, usdcAddress],
  contractAddress: tokenMessager,
  fee: {
    type: 'level',
    config: {
      feeLevel: 'MEDIUM'
    }
  }
})
console.log("bbb:", burn.data.id)
async function waitForTxHash(id, maxWaitMs = 60000, intervalMs = 3000) {
  const start = Date.now();

  while (Date.now() - start < maxWaitMs) {
    const res = await client.getTransaction({ id });
    console.log("res:", res)
    if (res.data?.transaction.state === "FAILED") {
      return res.data.transaction.state
    }

    if (res.data?.transaction?.txHash) {
      return res.data.transaction.txHash;
    }

    await new Promise(r => setTimeout(r, intervalMs));
  }

  return null; // Timed out without finding txHash
}


// Usage:

const txHash = await waitForTxHash(burn.data.id);
if (txHash === "FAILED") {
  return res.status(404).json({message: txHash})
}

console.log('txHash:', txHash);
console.log("retrieving messages")

  // 2. Get on-chain transaction receipt using txHash from Circle response
  const receipt = await web3.eth.getTransactionReceipt(txHash);

  // 3. Decode messageBytes from MessageSent(bytes) event
  const eventTopic = web3.utils.keccak256('MessageSent(bytes)');
  const log = receipt.logs.find(l => l.topics[0] === eventTopic);
  if (!log) {
    throw new Error('MessageSent event not found in transaction logs');
  }
  const decoded = web3.eth.abi.decodeParameters(['bytes'], log.data);
  const messageBytes = decoded[0];
  console.log("byte:", messageBytes)

  // 4. Hash the messageBytes with Keccak256 to get messageHash
  const messageHash = web3.utils.keccak256(messageBytes);

 let attestationResponse = { status: 'pending' }; 

while (attestationResponse.status !== 'complete') {
  const response = await fetch(`https://iris-api-sandbox.circle.com/attestations/${messageHash}`);
  if (response.status === 404) {
  } else if (!response.ok) {
    throw new Error(`Iris API error: ${response.status}`);
  } else {
    attestationResponse = await response.json();
    if (attestationResponse.status === 'pending') {
    }
  }
  if (attestationResponse.status !== 'complete') {
    await new Promise(r => setTimeout(r, 2000));
  }
}

 
 const mint = await client.createContractExecutionTransaction({
  walletId: destWalletId,
  abiFunctionSignature: "receiveMessage(bytes,bytes)",
  abiParameters: [messageBytes, attestationResponse.attestation],
  contractAddress: messageTransminter,
  fee: {
    type: 'level',
    config: {
      feeLevel: 'MEDIUM'
    }
  }
}); 

return res.status(200).json({message: "successfully sent", data: mint.data})
 /* console.log("minted:", mint.data)
let mintStatus = mint.data.state;
while (mintStatus === "INITIATED" || mintStatus === "PENDING" || mintStatus === "IN_PROGRESS") {
  await new Promise(r => setTimeout(r, 5000));
  const txInfo = await client.getTransaction({id: mint.data.id});
  console.log("minted:", txInfo.data.transaction)
  mintStatus = txInfo.data.transaction.state;
  console.log("Mint status:", mintStatus);
  if (mintStatus === "FAILED") {
    console.error("Mint failed:", txInfo.data.transaction.errorReason, txInfo.data.transaction.errorDetails);
    break;
  }
  if (mintStatus === "COMPLETE") {
    console.log("✅ Mint successful:", txInfo.data.transaction.txHash);
    break;
  }
}
 
 */


} catch (err) {
  console.log("err:", err)
  return res.status(500).json({Error: err})
}

}





export { createWallet, getAllUserWalletAddress, getSpecificWallet, getWalletBalance, sendTransaction, getTransactions, changeVaultName, postPaymentInfo, getParticularPayment, getUserPaymentsHistory, handleCrossChain /* getAttestation */, mint}