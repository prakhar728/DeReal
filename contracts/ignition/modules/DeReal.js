const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
const fs = require('fs');
const path = require('path');

module.exports = buildModule("DeReal", (m) => {
  // Deploy the DeReal contract
  const contract = m.contract("DeReal", [], {});

  // After deployment, copy the compiled .json file to client/contracts
  const srcPath = path.join(__dirname, '../../', 'artifacts', 'contracts', 'DeReal.sol', 'DeReal.json');
  const destPath = path.join(__dirname, '../../../', 'client', 'contracts', 'DeReal.json');

  // Ensure the destination directory exists
  if (!fs.existsSync(path.dirname(destPath))) {
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
  }

  // Copy the file
  fs.copyFileSync(srcPath, destPath);
  console.log(`Contract ABI copied to ${destPath}`);

  return { contract };
});
