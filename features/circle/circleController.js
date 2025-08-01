import dotenv from "dotenv";
dotenv.config();
import { generateEntitySecret } from '@circle-fin/developer-controlled-wallets';
import { registerEntitySecretCiphertext } from '@circle-fin/developer-controlled-wallets'
import { initiateDeveloperControlledWalletsClient } from '@circle-fin/developer-controlled-wallets'
import { getAddress } from "viem";
import User from "../user/model/userDetails.js";


 const client =  initiateDeveloperControlledWalletsClient({
  apiKey: process.env.CIRCLE_API_KEY,
  entitySecret: process.env.ENTITY_SECRET,
})
const walletSetResponse = await client.createWalletSet({
  name: 'LynkX',
})
//console.log("waale:", walletSetResponse.data?.walletSet?.id);
 
//console.log('Created WalletSet', walletSetResponse.data?.walletSet)
const createWallet = async (req, res) => {
    try {
        const { address, blockchains, walletName} = req.body;
        if (!address) return res.status(400).json({message: "address is required"})
        const checksumAddress = getAddress(address)
        if (!checksumAddress || !Array.isArray(blockchains) || blockchains.length === 0 || !walletName) {
            return res.status(400).json({message: "All fields are required to create a wallet"});
        }
        let user = await User.findOne({address: checksumAddress})
        if (!user) return res.status(400).json({message: "user not found"});
        //console.log("user:", user);
        const rolesMap = {
            merchant: 2,
            liquidityProvider: 7,
            treasuryManager: 7
        };
        console.log("role:", user.role)
        const limit = rolesMap[user.role];
        //if (user.wallets && user.wallets.length > 0) return res.status(200).json({message: "Wallet already created", user});
        if (user.wallets.length >= limit ) return res.status(400).json({message: "You have reached the maximum number of wallets you can create"})
       
        const walletsResponse = await client.createWallets({
        blockchains,
        count: 1,
        walletSetId: walletSetResponse.data?.walletSet?.id ?? '',
        })
        const wallet = walletsResponse?.data?.wallets.map((wallet) => ({...wallet, walletName}))
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
     
   /*  const estimateFee = await client.estimateTransferFee({
    amount: ['0.02'],
    destinationAddress: "0x9be0d97aba9e2fe6eb12802406a46d5b5e686a7b",
    tokenId: "bdf128b4-827b-5267-8f9e-243694989b5f",
    walletId: "7465e3a3-baa4-512f-b25c-c5ff3c0342e4",
    });
    console.log("estimate:",  estimateFee?.data)  */
   

   

   } catch (err) {
    console.log("err:", err)
    res.json(err)

   }
    

    // call 
    //const {amount, tokenId, destinationAddress, fee, walletId} = req.body;
    //if (!amount || !tokenId || !destinationAddress || !fee || !walletId) return res.status(400).json({message: "All field are required"});
    // call the circle backend
  /*   try {
        const response = await client.createTransaction({
        
        amount: ['0.01'],
        destinationAddress: "0x9be0d97aba9e2fe6eb12802406a46d5b5e686a7b",
        tokenId: "bdf128b4-827b-5267-8f9e-243694989b5f",
        walletId: "7465e3a3-baa4-512f-b25c-c5ff3c0342e4",
        fee: {
            type: 'level',
            config: {
            feeLevel: 'HIGH',
            },
        },
        })
        console.log(response?.data)
        return res.status(200).json({message: "sent", data: response?.data})
    } catch (err) {
        console.log("err:", err)
        return res.json({message: err})
        console.log("err:", err)
    } */
    

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
        {/* const user = await User.findOne({address: checksumAddress})
        if (!user) return res.status(401).json({message: "Invalid user"});
        const walletToChange = user.wallets.find((wallet) => getAddress(wallet.address) === checkVaultAddress)
        if (!walletToChange) {
            return res.status(404).json({ message: "Wallet not found" });
        }
        walletToChange.walletName = vaultName;
        await user.save(); */}
        //const updatedUser = await User.findOne({ address: checksumAddress });
        //console.log("DB After Save >>>", updatedUser);
        //return res.json({ message: "Wallet name updated successfully", data: user });
    } catch (err) {
        console.log("err:", err)
    }
}


export { createWallet, getAllUserWalletAddress, getSpecificWallet, getWalletBalance, sendTransaction, getTransactions, changeVaultName}