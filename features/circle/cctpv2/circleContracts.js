import dotenv from "dotenv";
dotenv.config();
export const circleContracts  = {
  TokenMessengerV2: {
    ethereumSepolia: "0x9f3B8679c73C2Fef8b59B4f3444d4e156fb70AA5",
    avalancheFuji: "0xeb08f243E5d3FCFF26A9E38Ae5520A669f4019d0",
    baseSepolia: "0x9f3B8679c73C2Fef8b59B4f3444d4e156fb70AA5",
    polygonAmoy: "0x9f3B8679c73C2Fef8b59B4f3444d4e156fb70AA5",
  },
  MessageTransmitterV2: {
   ethereumSepolia: "0x7865fAfC2db2093669d92c0F33AeEF291086BEFD",
    avalancheFuji: "0xa9fB1b3009DCb79E2fe346c16a604B8Fa8aE0a79",
    baseSepolia: "0x7865fAfC2db2093669d92c0F33AeEF291086BEFD",
    polygonAmoy: "0x7865fAfC2db2093669d92c0F33AeEF291086BEFD",
  },
  TokenMinterV2: {
    ethereumSepolia: "0x7865fAfC2db2093669d92c0F33AeEF291086BEFD",
    avalancheFuji: "0xa9fB1b3009DCb79E2fe346c16a604B8Fa8aE0a79",
    baseSepolia: "0x7865fAfC2db2093669d92c0F33AeEF291086BEFD",
    polygonAmoy: "0xb43db544E2c27092c107639Ad201b3dEfAbcF192",
    unichainSepolia: "0xb43db544E2c27092c107639Ad201b3dEfAbcF192",
  },
  MessageV2: {
    ethereumSepolia: "0xbaC0179bB358A8936169a63408C8481D582390C4",
    avalancheFuji: "0xbaC0179bB358A8936169a63408C8481D582390C4",
    opSepolia: "0xbac0179bb358a8936169a63408c8481d582390c4",
    arbitrumSepolia: "0xbaC0179bB358A8936169a63408C8481D582390C4",
    baseSepolia: "0xbaC0179bB358A8936169a63408C8481D582390C4",
    polygonAmoy: "0xbac0179bb358a8936169a63408c8481d582390c4",
    unichainSepolia: "0xbaC0179bB358A8936169a63408C8481D582390C4",
  }
};

export const USDC_CONTRACTS = {
  polygonAmoy: "0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582",
  opSepolia: "0x5fd84259d66Cd46123540766Be93DFE6D43130D7",
  lineaSepolia: "0xFEce4462D57bD51A6A552365A011b95f0E16d9B7",
  ethereumSepolia: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
  baseSepolia: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
  arbitrumSepolia: "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d",
  avalancheFuji: "0x5425890298aed601595a70AB815c96711a31Bc65",
};

export const RPC_URLS = {
  ethereumSepolia: `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`,
  polygonAmoy: `https://rpc-amoy.polygon.technology/`,
  baseSepolia: `https://sepolia.base.org`,
  avalancheFuji: `https://api.avax-test.network/ext/bc/C/rpc`
};

export const chainExplorers = {
  ethereumSepolia: {
    apiUrl: "https://api-sepolia.etherscan.io/api",
    apiKey: process.env.ETHERSCAN_API_KEY
  },
  avalancheFuji: {
    apiUrl: "https://api-testnet.snowtrace.io/api",
    apiKey: process.env.SNOWTRACE_API_KEY
  },
  opSepolia: {
    apiUrl: "https://api-sepolia-optimistic.etherscan.io/api",
    apiKey: process.env.OPTIMISTIC_API_KEY
  },
  arbitrumSepolia: {
    apiUrl: "https://api-sepolia.arbiscan.io/api",
    apiKey: process.env.ARBISCAN_API_KEY
  },
  baseSepolia: {
    apiUrl: "https://api-sepolia.basescan.org/api",
    apiKey: process.env.BASESCAN_API_KEY
  },
  polygonAmoy: {
    apiUrl: "https://api-amoy.polygonscan.com/api",
    apiKey: process.env.POLYGONSCAN_API_KEY
  },
  unichainSepolia: {
    apiUrl: "https://api-sepolia.etherscan.io/api", // fallback to etherscan (custom)
    apiKey: process.env.ETHERSCAN_API_KEY
  }
};

// knownContracts.js

export const knownContracts = {
  // ==================== TokenMessengerV2 ====================
  "ethereumsepolia-0x8fe6b999dc680ccfdd5bf7eb0974218be2542daa": "TokenMessengerV2",
  "avalanchefuji-0x8fe6b999dc680ccfdd5bf7eb0974218be2542daa": "TokenMessengerV2",
  "opsepolia-0x8fe6b999dc680ccfdd5bf7eb0974218be2542daa": "TokenMessengerV2",
  "arbitrumsepolia-0x8fe6b999dc680ccfdd5bf7eb0974218be2542daa": "TokenMessengerV2",
  "basesepolia-0x8fe6b999dc680ccfdd5bf7eb0974218be2542daa": "TokenMessengerV2",
  "polygonposamoy-0x8fe6b999dc680ccfdd5bf7eb0974218be2542daa": "TokenMessengerV2",
  "unichainsepolia-0x8fe6b999dc680ccfdd5bf7eb0974218be2542daa": "TokenMessengerV2",

  // ==================== MessageTransmitterV2 ====================
  "ethereumsepolia-0xe737e5cebeeba77efe34d4aa090756590b1ce275": "MessageTransmitterV2",
  "avalanchefuji-0xe737e5cebeeba77efe34d4aa090756590b1ce275": "MessageTransmitterV2",
  "opsepolia-0xe737e5cebeeba77efe34d4aa090756590b1ce275": "MessageTransmitterV2",
  "arbitrumsepolia-0xe737e5cebeeba77efe34d4aa090756590b1ce275": "MessageTransmitterV2",
  "basesepolia-0xe737e5cebeeba77efe34d4aa090756590b1ce275": "MessageTransmitterV2",
  "polygonposamoy-0xe737e5cebeeba77efe34d4aa090756590b1ce275": "MessageTransmitterV2",
  "unichainsepolia-0xe737e5cebeeba77efe34d4aa090756590b1ce275": "MessageTransmitterV2",

  // ==================== TokenMinterV2 ====================
  "ethereumsepolia-0xb43db544e2c27092c107639ad201b3defabcf192": "TokenMinterV2",
  "avalanchefuji-0xb43db544e2c27092c107639ad201b3defabcf192": "TokenMinterV2",
  "opsepolia-0xb43db544e2c27092c107639ad201b3defabcf192": "TokenMinterV2",
  "arbitrumsepolia-0xb43db544e2c27092c107639ad201b3defabcf192": "TokenMinterV2",
  "basesepolia-0xb43db544e2c27092c107639ad201b3defabcf192": "TokenMinterV2",
  "polygonposamoy-0xb43db544e2c27092c107639ad201b3defabcf192": "TokenMinterV2",
  "unichainsepolia-0xb43db544e2c27092c107639ad201b3defabcf192": "TokenMinterV2",

  // ==================== MessageV2 ====================
  "ethereumsepolia-0xbac0179bb358a8936169a63408c8481d582390c4": "MessageV2",
  "avalanchefuji-0xbac0179bb358a8936169a63408c8481d582390c4": "MessageV2",
  "opsepolia-0xbac0179bb358a8936169a63408c8481d582390c4": "MessageV2",
  "arbitrumsepolia-0xbac0179bb358a8936169a63408c8481d582390c4": "MessageV2",
  "basesepolia-0xbac0179bb358a8936169a63408c8481d582390c4": "MessageV2",
  "polygonposamoy-0xbac0179bb358a8936169a63408c8481d582390c4": "MessageV2",
  "unichainsepolia-0xbac0179bb358a8936169a63408c8481d582390c4": "MessageV2"
};


