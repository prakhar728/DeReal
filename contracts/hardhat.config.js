require("@nomiclabs/hardhat-waffle");
require("@nomicfoundation/hardhat-ignition");
require("dotenv").config(); // Load environment variables

module.exports = {
  solidity: "0.8.17",
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL, // Sepolia RPC URL from .env
      accounts: [`0x${process.env.PRIVATE_KEY}`], // Private key from .env
    },
    opSep : {
      url: process.env.OP_SEPOLIA,
      accounts: [`0x${process.env.PRIVATE_KEY}`], // Private key from .env
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY // Etherscan API key from .env
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
};
