import dotenv from "dotenv";
dotenv.config();
import { generateEntitySecret } from '@circle-fin/developer-controlled-wallets';
import { registerEntitySecretCiphertext } from '@circle-fin/developer-controlled-wallets'
import { initiateDeveloperControlledWalletsClient } from '@circle-fin/developer-controlled-wallets'
import { getAddress } from "viem";
import User from "../user/model/userDetails.js";



const client = initiateDeveloperControlledWalletsClient({
  apiKey: process.env.API_KEY,
  entitySecret: process.env.ENTITY_SECRET,
})
const walletSetResponse = await client.createWalletSet({
  name: 'LynkX',
})

//console.log('Created WalletSet', walletSetResponse.data?.walletSet)
const createWallet = async (req, res) => {
    try {
        const { address, blockchains} = req.body;
        if (!address) return res.status(400).json({message: "address is required"})
        const checksumAddress = getAddress(address)
        if (!checksumAddress || !blockchains) {
            return res.status(400).json({message: "All fields are required to create a wallet"});
        }
        let user = await User.findOne({address: checksumAddress})
        if (!user) return res.status(400).json({message: "user not found"});
        //console.log("user:", user);
        const walletsResponse = await client.createWallets({
        blockchains,
        count: 1,
        walletSetId: walletSetResponse.data?.walletSet?.id ?? '',
        })
       
        user.wallets = walletsResponse.data?.wallets || [];
        await user.save();
         console.log('Created Wallets', user)
        
        return res.status(201).json({message: "wallet succesfully created", user})
        //console.log("user", {...user.toObject(), wallets: walletsResponse.data?.wallets})
        //if (walletSetResponse) return res.status(201).json({})

        //
    } catch (err) {
        console.log("err:", err)
    }
}

export { createWallet }