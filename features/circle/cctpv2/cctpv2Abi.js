import express from "express";
import axios from "axios";
import fs from "fs";
import path from "path";
import { chainExplorers, knownContracts } from "./circleContracts.js";

const abiRouter = express.Router();
const CACHE_FILE = path.join(process.cwd(), "abiCacheV2.json"); // <-- New cache file

// ------------------ CACHE HANDLING ------------------
let abiCache = {};
if (fs.existsSync(CACHE_FILE)) {
  abiCache = JSON.parse(fs.readFileSync(CACHE_FILE, "utf8"));
}
function saveCache() {
  fs.writeFileSync(CACHE_FILE, JSON.stringify(abiCache, null, 2));
}

// ------------------ NORMALIZE CHAIN ------------------
function normalizeChainName(chain) {
  switch (chain.toLowerCase()) {
    case "ethereumsepolia": return "ethereumSepolia";
    case "avalanchefuji": return "avalancheFuji";
    case "opsepolia": return "opSepolia";
    case "arbitrumsepolia": return "arbitrumSepolia";
    case "basesepolia": return "baseSepolia";
    case "polygonposamoy": return "polygonAmoy";
    case "unichainsepolia": return "unichainSepolia";
    default: return chain; // fallback
  }
}

// ------------------ FETCH ABI FROM EXPLORER ------------------
async function fetchAbi(chain, address) {
  const explorer = chainExplorers[chain];
  if (!explorer) throw new Error(`Unsupported chain: ${chain}`);
  if (!explorer.apiKey) throw new Error(`Missing API key for ${chain}`);

  const url = `${explorer.apiUrl}?module=contract&action=getabi&address=${address}&apikey=${explorer.apiKey}`;
  const response = await axios.get(url);
  if (response.data.status !== "1") {
    throw new Error(`Explorer error: ${response.data.result}`);
  }
  return JSON.parse(response.data.result);
}

// ------------------ /ALL ENDPOINT ------------------
abiRouter.get("/all", async (req, res) => {
  try {
    const results = await Promise.all(
      Object.entries(knownContracts).map(async ([key, contractName]) => {
        const [chain, address] = key.split("-");
        const normalizedChain = normalizeChainName(chain);
        const cacheKey = `${normalizedChain}-${address.toLowerCase()}`;

        // Check cache (new format only)
        if (abiCache[cacheKey]) {
          return {
            chain: normalizedChain,
            address,
            contractName: abiCache[cacheKey].contractName || contractName,
            abi: abiCache[cacheKey].abi,
            source: "fileCache"/*  */
          };
        }

        // Fetch from explorer
        try {
          await new Promise((r) => setTimeout(r, 600));
          const abi = await fetchAbi(normalizedChain, address);
          abiCache[cacheKey] = { abi, contractName };
          saveCache();
          return { chain: normalizedChain, address, contractName, abi, source: "explorer" };
        } catch (err) {
          return { chain: normalizedChain, address, contractName, error: err.message };
        }
      })
    );

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default abiRouter;
