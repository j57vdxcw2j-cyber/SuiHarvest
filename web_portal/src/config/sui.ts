import { getFullnodeUrl } from '@mysten/sui/client';
import { createNetworkConfig } from '@mysten/dapp-kit';

// Network configuration for Sui
const { networkConfig, useNetworkVariable, useNetworkVariables } = createNetworkConfig({
  // Mainnet
  mainnet: {
    url: getFullnodeUrl('mainnet'),
  },
  // Testnet
  testnet: {
    url: getFullnodeUrl('testnet'),
  },
  // Devnet  
  devnet: {
    url: getFullnodeUrl('devnet'),
  },
  // Localnet (for local development)
  localnet: {
    url: 'http://127.0.0.1:9000',
  },
});

export { networkConfig, useNetworkVariable, useNetworkVariables };
