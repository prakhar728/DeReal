import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";

import "./index.css";
import HomePage from "./pages/HomePage/HomePage";
import App from "./pages/App/App";
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";

import { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector";
import { createConfig, WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http } from "viem";
import { auroraTestnet } from "viem/chains";

const config = createConfig({
  chains: [auroraTestnet],
  multiInjectedProviderDiscovery: false,
  transports: {
    [auroraTestnet.id]: http(),
  },
});

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/app",
    element: <App />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <DynamicContextProvider
      settings={{
        // Find your environment id at https://app.dynamic.xyz/dashboard/developer
        environmentId: process.env.REACT_APP_DYNAMIC_ENVIRONMENT_ID,
        walletConnectors: [EthereumWalletConnectors],
      }}
    >
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <DynamicWagmiConnector>
            <RouterProvider router={router} />
          </DynamicWagmiConnector>
        </QueryClientProvider>
      </WagmiProvider>
    </DynamicContextProvider>
  </React.StrictMode>
);
