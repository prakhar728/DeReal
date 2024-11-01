// Load dependencies
const express = require("express");
const { ethers, Contract } = require("ethers");
const { beginIndexingDeReal } = require("./events/DeReal");
const { beginIndexingAdContract } = require("./events/AdContract");
const { connectToDB } = require("./lib/DB");
const DE_REAL_CONTRACT = require("./contracts/DeReal.json");
const AD_CONTRACT_JSON = require("./contracts/AdContract.json");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Set up provider and constants from environment variables
const PROVIDER_URL = process.env.PROVIDER_URL || "https://testnet.aurora.dev/";
const DEREAL_CONTRACT_ADDRESS = process.env.DEREAL_CONTRACT_ADDRESS || "0x46a2a933575CBbA90764579DfbD3B89e0e21A49e";
const AD_CONTRACT_ADDRESS = process.env.AD_CONTRACT_ADDRESS || "0x39C2DB72cCB9887E6712f0125730733F391BC3A7";

// Contract ABIs
const DE_REAL_CONTRACT_ABI = DE_REAL_CONTRACT.abi;
const AD_CONTRACT_ABI = AD_CONTRACT_JSON.abi;

// Initialize provider
const provider = new ethers.JsonRpcProvider(PROVIDER_URL);

// Main function to set up and start indexing
async function startIndexing() {
  try {
    console.log("Connecting to database...");
    const db = await connectToDB();

    console.log("Setting up contract instances...");
    const deRealContract = new Contract(DEREAL_CONTRACT_ADDRESS, DE_REAL_CONTRACT_ABI, provider);
    const adContract = new Contract(AD_CONTRACT_ADDRESS, AD_CONTRACT_ABI, provider);

    console.log("Starting to index DeReal contract events...");
    beginIndexingDeReal(provider, deRealContract, db);

    console.log("Starting to index AdContract events...");
    beginIndexingAdContract(provider, adContract, db);

    console.log("Indexing has started successfully.");
  } catch (error) {
    console.error("Failed to initialize indexing:", error);
  }
}

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).send("Server is up and running.");
});

// Start the Express server and the indexing process
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await startIndexing(); // Start indexing as a background task
});

// Graceful shutdown handling
process.on("SIGINT", () => {
  console.log("Received SIGINT, shutting down gracefully...");
  process.exit();
});
process.on("SIGTERM", () => {
  console.log("Received SIGTERM, shutting down gracefully...");
  process.exit();
});
