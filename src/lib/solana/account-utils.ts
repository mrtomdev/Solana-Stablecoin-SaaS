import { Connection, PublicKey } from '@solana/web3.js';
import {
  TOKEN_2022_PROGRAM_ID,
  getAssociatedTokenAddressSync,
  getAccount,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from '@solana/spl-token';

export function getATA(mint: PublicKey, owner: PublicKey): PublicKey {
  return getAssociatedTokenAddressSync(mint, owner, false, TOKEN_2022_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID);
}

export async function ataExists(connection: Connection, ata: PublicKey): Promise<boolean> {
  try {
    await getAccount(connection, ata, undefined, TOKEN_2022_PROGRAM_ID);
    return true;
  } catch {
    return false;
  }
}

export async function getTokenBalance(connection: Connection, mint: PublicKey, owner: PublicKey): Promise<bigint> {
  try {
    const ata = getATA(mint, owner);
    const account = await getAccount(connection, ata, undefined, TOKEN_2022_PROGRAM_ID);
    return account.amount;
  } catch {
    return BigInt(0);
  }
}
