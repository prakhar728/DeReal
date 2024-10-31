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

const AD_CONTRACT = "0xfc052abb90F5bD0b0C161105A9E2f9BF933fDFFA";

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
