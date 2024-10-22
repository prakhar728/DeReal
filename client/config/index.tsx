
// config/index.tsx

import { cookieStorage, createStorage, http } from '@wagmi/core'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { auroraTestnet } from '@reown/appkit/networks'

// Get projectId from https://cloud.reown.com
export const projectId = 'c678414ecde341c77bf73aeeaf92b9e2'

if (!projectId) {
  throw new Error('Project ID is not defined')
}

export const networks = [auroraTestnet];

//Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage
  }),
  ssr: true,
  projectId,
  networks
})

export const config = wagmiAdapter.wagmiConfig