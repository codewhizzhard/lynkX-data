import dotenv from "dotenv";
dotenv.config();
export const circleContracts  = {
  TokenMessengerV2: {
    ethereumSepolia: "0x8FE6B999Dc680CcFDD5Bf7EB0974218be2542DAA",
    avalancheFuji: "0x8FE6B999Dc680CcFDD5Bf7EB0974218be2542DAA",
    opSepolia: "0x8FE6B999Dc680CcFDD5Bf7EB0974218be2542DAA",
    arbitrumSepolia: "0x8FE6B999Dc680CcFDD5Bf7EB0974218be2542DAA",
    baseSepolia: "0x8FE6B999Dc680CcFDD5Bf7EB0974218be2542DAA",
    polygonAmoy: "0x8FE6B999Dc680CcFDD5Bf7EB0974218be2542DAA",
    unichainSepolia: "0x8FE6B999Dc680CcFDD5Bf7EB0974218be2542DAA",
  },
  MessageTransmitterV2: {
    ethereumSepolia: "0xE737e5cEBEEBa77EFE34D4aa090756590b1CE275",
    avalancheFuji: "0xE737e5cEBEEBa77EFE34D4aa090756590b1CE275",
    opSepolia: "0xE737e5cEBEEBa77EFE34D4aa090756590b1CE275",
    arbitrumSepolia: "0xE737e5cEBEEBa77EFE34D4aa090756590b1CE275",
    baseSepolia: "0xE737e5cEBEEBa77EFE34D4aa090756590b1CE275",
    polygonAmoy: "0xE737e5cEBEEBa77EFE34D4aa090756590b1CE275",
    unichainSepolia: "0xE737e5cEBEEBa77EFE34D4aa090756590b1CE275",
  },
  TokenMinterV2: {
    ethereumSepolia: "0xb43db544E2c27092c107639Ad201b3dEfAbcF192",
    avalancheFuji: "0xb43db544E2c27092c107639Ad201b3dEfAbcF192",
    opSepolia: "0xb43db544E2c27092c107639Ad201b3dEfAbcF192",
    arbitrumSepolia: "0xb43db544E2c27092c107639Ad201b3dEfAbcF192",
    baseSepolia: "0xb43db544E2c27092c107639Ad201b3dEfAbcF192",
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


export const chainExplorers = {
  ethereumSepolia: {
    apiUrl: "https://api-sepolia.etherscan.io/api",
    apiKey: process.env.ETHERSCAN_API_KEY
  },
  /* avalancheFuji: {
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
  } */
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


