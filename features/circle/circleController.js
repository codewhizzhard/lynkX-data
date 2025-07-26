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
console.log("waale:", walletSetResponse.data?.walletSet?.id);
 
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

export { createWallet, getAllUserWalletAddress, getSpecificWallet, getWalletBalance}