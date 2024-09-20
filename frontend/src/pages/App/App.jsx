import { useEffect, useState } from "react";
import "./App.css";

import {
  DynamicWidget,
} from "@dynamic-labs/sdk-react-core";
import rightarrow from "../../assets/8-bit-right-arrow.gif";
import UploadPhotoModal from "../../components/UploadModal/UploadModal.jsx";
import ProfileUpdateModal from "../../components/ProfileUpdateModal/ProfileUploadModal.jsx";
import { useBiconomyAccount } from "../../useBiconomyAccount.js";

function App() {
  const { smartAccount } = useBiconomyAccount();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [walletAddress, setwalletAddress] = useState("");

  useEffect(() => {
    async function walletPopulate() {
      setwalletAddress(await smartAccount.getAccountAddress());
    }    

    if(smartAccount)
      walletPopulate();

  }, [smartAccount])
  

  const handleUpdate = async () => {
    console.log("Updating profile");
  };

  return (
    <div className="App">

        <header className="grid items-center justify-items-end">
          <div className="grid items-center justify-items-end">
            <DynamicWidget />
          </div>
        </header>

        <div className="cta-section">
          <h2>Ready for spontaneous sharing?</h2>
          <button className="cta-button" onClick={() => setIsModalOpen(true)}>
            Upload Photo
            <img src={rightarrow} alt="right-arrow" className="right-arrow" />
          </button>
        </div>
        <UploadPhotoModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />

      {walletAddress && (
        <ProfileUpdateModal
          walletAddress={walletAddress}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
}

export default App;
