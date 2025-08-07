//import express from "express"
import circleClient from "./circleClient.js"

const getPublicKeys = async(req, res) => {
    try {
        const response = await circleClient.get("/v2/publicKeys")
        console.log("response:", response.data)
        res.status(200).json({message: response.data})
    } catch (err) {
        console.log("err:", err)
        res.status(404).json({message: err})
    }
}

const getMsgAndAttestation = async(req, res) => {
    const {sourceDomainId, transactionHash, nonce} = req.query;

 
    if (!sourceDomainId || (!nonce && !transactionHash)) {
        return res.status(400).json({ message: "sourceDomainId and either transactionHash or nonce are required" });
    }

    const params = new URLSearchParams();
    if (transactionHash) params.append("transactionHash", transactionHash);
    if (nonce) params.append("nonce", nonce);

    const url = `/v2/messages/${sourceDomainId}?${params.toString()}`;

    try {
        const response = await circleClient.get(url)
        console.log("response:", response.data)
        res.status(200).json({message: response.data})
    } catch (err) {
        console.log("err:", err)
        res.status(404).json({message: err})
    }
}

const getUSDCGasFee = async(req, res) => {
    const {sourceDomainId, destDomainId} = req.params;
    if (!sourceDomainId || !destDomainId) return res.status(400).json({message: "All fields are required"});
    try {
        const response = await circleClient.get(`/v2/burn/USDC/fees/${sourceDomainId}/${destDomainId}`)
        console.log("response:", response.data)
        return res.status(200).json({message: response.data})
    } catch (err) {
        console.log("err:", err)
        res.status(404).json({message: err})
    }
}

export {getPublicKeys, getMsgAndAttestation, getUSDCGasFee}