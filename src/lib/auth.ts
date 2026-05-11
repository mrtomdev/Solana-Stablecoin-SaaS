import { Connection, PublicKey } from '@solana/web3.js';
import { getMint, TOKEN_2022_PROGRAM_ID } from '@solana/spl-token';

export async function isWalletAuthority(
  connection: Connection,
  mintAddress: PublicKey,
  walletAddress: PublicKey
): Promise<{ isMintAuthority: boolean; isFreezeAuthority: boolean }> {
  try {
    const mintInfo = await getMint(connection, mintAddress, undefined, TOKEN_2022_PROGRAM_ID);
    return {
      isMintAuthority: mintInfo.mintAuthority?.equals(walletAddress) ?? false,
      isFreezeAuthority: mintInfo.freezeAuthority?.equals(walletAddress) ?? false,
    };
  } catch {
    return { isMintAuthority: false, isFreezeAuthority: false };
  }
}
