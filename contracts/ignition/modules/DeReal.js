const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("DeReal", (m) => {

  // Deploy the DeReal contract
  const contract = m.contract("DeReal", [], {
  });

  return { contract };
});
