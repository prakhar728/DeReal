const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
const { ethers } = require("ethers"); // Import ethers explicitly

module.exports = buildModule("DeReal", (m) => {
  // Define or import addresses for Pyth's Entropy contract and provider
  const ENTROPY_ADDRESS = "0x4821932D0CDd71225A6d914706A621e0389D7061"; // Replace with actual address
  const PROVIDER_ADDRESS = "0x6CC14824Ea2918f5De5C2f75A9Da968ad4BD6344"; // Replace with actual address

  // Deploy the DeReal contract
  const contract = m.contract("DeReal", [ENTROPY_ADDRESS, PROVIDER_ADDRESS], {
    value: ethers.parseEther("0.001"), // Use ethers directly here
  });

  return { contract };
});
