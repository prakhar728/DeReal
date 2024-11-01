const express = require("express");
const ethers = require("ethers");
const cron = require("node-cron");
const contract_json = require("./contracts/DeReal.json");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5777;

// Load environment variables for wallet and contract configuration
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const INFURA_URL = process.env.INFURA_URL; // Or other RPC provider

// Initialize ethers provider and wallet
const provider = new ethers.JsonRpcProvider(INFURA_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
let contract;

// Define ABI of the smart contract (simplified)
const abi = contract_json.abi;

// Initialize the contract instance
function initializeContract() {
  contract = new ethers.Contract(CONTRACT_ADDRESS, abi, wallet);
}

// Function to generate a truly random time delay in milliseconds within 5-6 hours
function generateRandomDelay() {
  const minDelay = 5 * 60 * 60 * 1000; // 5 hours in milliseconds
  const maxDelay = 6 * 60 * 60 * 1000; // 6 hours in milliseconds
  return Math.floor(Math.random() * (maxDelay - minDelay + 1) + minDelay);
}

// Function to trigger the event on the contract
async function triggerSmartContractEvent() {
  try {
    const tx = await contract.triggerCamera(); // Call the smart contract function
    await tx.wait(); // Wait for the transaction to be confirmed
    console.log(`Event triggered on contract at ${new Date().toLocaleTimeString()}`);
  } catch (error) {
    console.error("Failed to trigger event:", error);
  }
}

// Schedule the next event with a random delay
function scheduleNextEvent() {
  const delay = generateRandomDelay();
  console.log(`Next event scheduled in ${delay / 1000 / 60} minutes`);

  setTimeout(async () => {
    await triggerSmartContractEvent(); // Trigger the event on the contract
    scheduleNextEvent(); // Schedule the next random event
  }, delay);
}

// Start the server and initialize perpetual scheduling
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  initializeContract();
  scheduleNextEvent(); // Start the perpetual loop of event scheduling
});
