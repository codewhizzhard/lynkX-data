/* const CCTP_ADDRESSES = {
  ethereum: {
    tokenMessenger: '0xBd3fa81B58Ba92a82136038B25aDec7066af3155',
    messageTransmitter: '0x0a992d191deec32afe36203ad87d7d289a738f81',
    usdc: '0xA0b86a33E6441E8Dd4c4b9A6b3f2D4565d7e1e8e'
  },
  arbitrum: {
    tokenMessenger: '0x19330d10D9Cc8751218eaf51E8885D058642E08A',
    messageTransmitter: '0xC30362313FBBA5cf9163F0bb16a0e01f01A896ca',
    usdc: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831'
  },
  polygon: {
    tokenMessenger: '0x9daF8c91AEFAE50b9c0E69629D3F6Ca40cA3B3FE',
    messageTransmitter: '0xF3be9355363857F3e001be68856A2f96b4C39Ba9',
    usdc: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174'
  }
}; */
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

