import express from "express";
import axios from "axios";
import fs from "fs";
import path from "path";
import { circleContracts, chainExplorers } from "./circleContracts.js";

const abiRouter = express.Router();
const CACHE_FILE = path.join(process.cwd(), "abiCache.json");

// Load cache from file on startup
let abiCache = {};
if (fs.existsSync(CACHE_FILE)) {
  abiCache = JSON.parse(fs.readFileSync(CACHE_FILE, "utf8"));
}

// Save cache to file
function saveCache() {
  fs.writeFileSync(CACHE_FILE, JSON.stringify(abiCache, null, 2));
}

// Fetch ABI from explorer
async function fetchAbi(chain, address) {
  const explorer = chainExplorers[chain];
  if (!explorer) throw new Error(`Unsupported chain: ${chain}`);
  if (!explorer.apiKey) throw new Error(`Missing API key for ${chain}`);

  const url = `${explorer.apiUrl}?module=contract&action=getabi&address=${address}&apikey=${explorer.apiKey}`;
  const response = await axios.get(url);
  if (response.data.status !== "1") throw new Error(`Explorer error: ${response.data.result}`);
  return JSON.parse(response.data.result);
}

// Route to fetch all ABIs
abiRouter.get("/all", async (req, res) => {
  try {
    const promises = Object.entries(circleContracts).map(async ([contract, chains]) => {
      const chainResults = await Promise.all(
        Object.entries(chains).map(async ([chain, address]) => {
          const cacheKey = `${chain}-${address}`;
          if (abiCache[cacheKey]) {
            return { chain, address, abi: abiCache[cacheKey], source: "fileCache" };
          }
          try {
            const abi = await fetchAbi(chain, address);
            abiCache[cacheKey] = abi;
            saveCache(); // save after every new fetch
            return { chain, address, abi, source: "explorer" };
          } catch (err) {
            return { chain, address, error: err.message };
          }
        })
      );
      return { contract, chainResults };
    });

    const allResults = await Promise.all(promises);
    res.json(allResults);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default abiRouter;
