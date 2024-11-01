const { beginIndexingDeReal } = require("./events/DeReal");

require("dotenv").config();
const { ethers, Contract } = require("ethers");
const { connectToDB } = require("./lib/DB");
const DE_REAL_CONTRACT = require("./contracts/DeReal.json");
const AD_CONTRACT_JSON = require("./contracts/AdContract.json");
const { beginIndexingAdContract } = require("./events/AdContract");

// Set up provider
const provider = new ethers.JsonRpcProvider("https://testnet.aurora.dev/");

const DEREAL_CONTRACT = "0x46a2a933575CBbA90764579DfbD3B89e0e21A49e";

const AD_CONTRACT = "0x39C2DB72cCB9887E6712f0125730733F391BC3A7";

const DE_REAL_CONTRACT_ABI = DE_REAL_CONTRACT.abi;
const AD_CONTRACT_ABI = AD_CONTRACT_JSON.abi;

async function main() {
  const db = await connectToDB();

  // Set up contract instance
  const de_real_contract = new Contract(DEREAL_CONTRACT, DE_REAL_CONTRACT_ABI, provider);
  const ad_contract = new Contract(AD_CONTRACT, AD_CONTRACT_ABI, provider);

  beginIndexingDeReal(provider, de_real_contract, db);
  beginIndexingAdContract(provider, ad_contract, db)
}

main().catch(console.error);
``;
