//import { getPublicKey } from "@circle-fin/developer-controlled-wallets/dist/types/clients/core";
import { getMsgAndAttestation, getPublicKeys, getUSDCGasFee } from "./cctpv2Controller.js";
import express from "express";

const cctpv2Router = express.Router();

cctpv2Router.get("/cctpv2/get-publicKeys", getPublicKeys);
cctpv2Router.get("/cctpv2/get-msg/attest", getMsgAndAttestation);
cctpv2Router.get("/cctpv2/get-usdc-fee", getUSDCGasFee);
export default cctpv2Router;