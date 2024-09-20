import { useState } from "react";
import "./App.css";

import {
  DynamicContextProvider,
  DynamicWidget,
} from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import rightarrow from "../../assets/8-bit-right-arrow.gif";
import Main from "../../Main.js";
import UploadPhotoModal from "../../components/UploadModal/UploadModal.jsx";

function App() {
  const [smartAccount, setSmartAccount] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="App">
      <DynamicContextProvider
        settings={{
          // Find your environment id at https://app.dynamic.xyz/dashboard/developer
          environmentId: process.env.REACT_APP_DYNAMIC_ENVIRONMENT_ID,
          walletConnectors: [EthereumWalletConnectors],
        }}
      >
        <DynamicWidget />

        <div className="cta-section">
          <h2>Ready for spontaneous sharing?</h2>
          <button className="cta-button" onClick={() => setIsModalOpen(true)}>
            Upload Photo
            <img src={rightarrow} alt="right-arrow" className="right-arrow" />
          </button>
        </div>
        <Main smartAccount={smartAccount} setSmartAccount={setSmartAccount} />
        <UploadPhotoModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </DynamicContextProvider>
    </div>
  );
}

export default App;
