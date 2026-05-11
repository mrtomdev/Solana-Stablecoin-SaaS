import { PublicKey } from '@solana/web3.js';

export const config = {
  rpcUrl: process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com',
  network: (process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet') as 'devnet' | 'mainnet-beta',
  mintAddress: process.env.NEXT_PUBLIC_MINT_ADDRESS || '',
  decimals: 6,
};

export function getMintPublicKey(): PublicKey | null {
  if (!config.mintAddress) return null;
  try {
    return new PublicKey(config.mintAddress);
  } catch {
    return null;
  }
}
