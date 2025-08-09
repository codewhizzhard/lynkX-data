import dotenv from "dotenv";
dotenv.config();
import { generateEntitySecret } from '@circle-fin/developer-controlled-wallets';
import { registerEntitySecretCiphertext } from '@circle-fin/developer-controlled-wallets'
import { initiateDeveloperControlledWalletsClient } from '@circle-fin/developer-controlled-wallets'
import { getAddress } from "viem";
import User from "../user/model/userDetails.js";
import Payments from "./model/paymentDetail.js";
import { v4 as uuidv4 } from "uuid";
import mongoose from "mongoose";
import Web3 from "web3";


 const client =  initiateDeveloperControlledWalletsClient({
  apiKey: process.env.CIRCLE_API_KEY,
  entitySecret: process.env.ENTITY_SECRET,
})
const walletSetResponse = await client.createWalletSet({
  name: 'LynkX',
})

const web3 = new Web3(`https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`);
//console.log("waale:", walletSetResponse.data?.walletSet?.id);
 
//console.log('Created WalletSet', walletSetResponse.data?.walletSet)
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
        walletSetId: walletSetResponse.data?.walletSet?.id ?? '',
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
        paymentObj.paymentLink = `https://localhost:5174/pay/${paymentObj._id}`; 
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
{/* 
const approve = async(req, res) => {
    //
    const {walletId, funcSig, abiParameter1, abiParameter2, contractAddress} = req.body;
    if (!walletId || !funcSig || !abiParameter1 || !abiParameter2 || !contractAddress) return res.status(400).json({message: "All fields are required"});

    try {
         const response = await client.createContractExecutionTransaction({
        walletId: walletId,
        abiFunctionSignature: funcSig,
        abiParameters:  [abiParameter1, abiParameter2],
        contractAddress: contractAddress,
        fee: {
        type: 'level',
        config: {
        feeLevel: 'MEDIUM'
        }
        }
    });

    return res.status(200).json({
      message: "Transaction created successfully",
      data: response
    });
    } catch (err) {
        console.log("err:", err)
    }

   

}
const burn = async (req, res) => {
  try {
    const { walletId, burnAmount, destDomain, destAddress, usdcContract, tkMess } = req.body;
    if (!walletId || !burnAmount || !destDomain || !destAddress || !usdcContract) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Encode destination address
    const encodedDestinationAddress = web3.eth.abi.encodeParameter("address", destAddress);

    const response = await client.createContractExecutionTransaction({
      walletId,
      abiFunctionSignature: "burn(uint256,uint32,bytes32,address)",
      abiParameters: [
        burnAmount, 
        destDomain, 
        encodedDestinationAddress, 
        usdcContract
      ],
      contractAddress: tkMess,
      fee: { type: "level", config: { feeLevel: "MEDIUM" } }
    });

    return res.json(response);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};


*/}

const getAttestation = async (req, res) => {
  try {
    const { txHash } = req.params;

    // Get transaction receipt
    console.log("ha:", txHash)
    const receipt = await web3.eth.getTransactionReceipt(txHash);
    console.log("receipt:", receipt)
    const eventTopic = web3.utils.keccak256("MessageSent(bytes)");
    const log = receipt.logs.find((l) => l.topics[0] === eventTopic);
    const messageBytes = web3.eth.abi.decodeParameters(["bytes"], log.data)[0];
    const messageHash = web3.utils.keccak256(messageBytes);
    console.log("messafeHas:",messageHash)

    // Poll Circle attestation service
    let attestationResponse = { status: "pending" };
    while (attestationResponse.status !== "complete") {
      const resp = await fetch(
        `https://iris-api-sandbox.circle.com/attestations/${messageHash}`
      );
      attestationResponse = await resp.json();
      console.log("atEase:", attestationResponse)
      if (attestationResponse.status !== "complete") {
        await new Promise((r) => setTimeout(r, 2000));
      }
    }

    return res.json(attestationResponse);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

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



const handleCrossChain = async (req, res) => {
  try {
    const {
      walletId,
      burnAmount,
      destDomain,
      destAddress,
      usdcContract,
      tkMess,
      msgTrans
    } = req.body;

    if (!walletId || !tkMess || !burnAmount || !destDomain || !destAddress || !usdcContract || !msgTrans) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 1. APPROVE
    console.log("Step 1: Approving USDC spending...");
    const approveTx = await client.createContractExecutionTransaction({
      walletId,
      abiFunctionSignature: "approve(address,uint256)",
      abiParameters: [tkMess, burnAmount], //tkMess
      contractAddress: usdcContract,
      fee: { type: "level", config: { feeLevel: "MEDIUM" } }
    });

    console.log("Approval transaction created:", approveTx);

    // 2. BURN
    console.log("Step 2: Burning USDC on source chain...");
    const encodedDestinationAddress = web3.eth.abi.encodeParameter("address", destAddress);
    const burnTx = await client.createContractExecutionTransaction({
      walletId,
      abiFunctionSignature: "burn(uint256,uint32,bytes32,address)",
      abiParameters: [
        burnAmount,
        destDomain,
        encodedDestinationAddress,
        usdcContract
      ],
      contractAddress: tkMess,
      fee: { type: "level", config: { feeLevel: "MEDIUM" } }
    });

    console.log("Burn transaction created:", burnTx);
    console.log("Burn transaction created:", burnTx.data.id); // burnTx.status == 201

     let transaction;
    while (!transaction?.txHash) {
      const txRes = await client.getTransaction({ id: burnTx.data.id });
      transaction = txRes.data;
      if (!transaction?.txHash) {
        console.log("Waiting for txHash...");
        await new Promise((r) => setTimeout(r, 2000));
      }
    }

    console.log("Source chain txHash:", transaction.txHash);

    // 3. GET ATTESTATION
    console.log("Step 3: Waiting for attestation...");
    const receipt = await web3.eth.getTransactionReceipt(transaction.txHash);
    const eventTopic = web3.utils.keccak256("MessageSent(bytes)");
    const log = receipt.logs.find(l => l.topics[0] === eventTopic);
    const messageBytes = web3.eth.abi.decodeParameters(["bytes"], log.data)[0];
    const messageHash = web3.utils.keccak256(messageBytes);

    let attestationResponse = { status: "pending" };
    while (attestationResponse.status !== "complete") {
      const resp = await fetch(`https://iris-api-sandbox.circle.com/attestations/${messageHash}`);
      attestationResponse = await resp.json();
      if (attestationResponse.status !== "complete") {
        await new Promise(r => setTimeout(r, 2000));
      }
    }

    console.log("Attestation received:", attestationResponse);

    // 4. MINT
    console.log("Step 4: Minting USDC on destination chain...");
    const mintTx = await client.createContractExecutionTransaction({
      walletId,
      abiFunctionSignature: "receiveMessage(bytes,bytes)",
      abiParameters: [attestationResponse.message, attestationResponse.attestation],
      contractAddress: msgTrans,
      fee: { type: "level", config: { feeLevel: "MEDIUM" } }
    });

    console.log("Mint transaction created:", mintTx);

    return res.json({
      message: "Cross-chain transfer completed successfully",
      approveTx,
      burnTx,
      attestationResponse,
      mintTx
    });

  } catch (err) {
    console.error("Error in handleCrossChain:", err);
    return res.status(500).json({ error: err.message });
  }
};


export { createWallet, getAllUserWalletAddress, getSpecificWallet, getWalletBalance, sendTransaction, getTransactions, changeVaultName, postPaymentInfo, getParticularPayment, getUserPaymentsHistory, handleCrossChain, getAttestation, mint}