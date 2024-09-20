import { useState } from "react";
import "./App.css";

import {
  DynamicContextProvider,
  DynamicWidget,
} from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import Main from "./Main.js";

function App() {
  const [smartAccount, setSmartAccount] = useState(null);

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
        <Main smartAccount={smartAccount} setSmartAccount={setSmartAccount} />
      </DynamicContextProvider>
    </div>
  );
}

export default App;
