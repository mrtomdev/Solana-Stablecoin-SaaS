import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { TOKEN_2022_PROGRAM_ID, createBurnInstruction } from '@solana/spl-token';
import { getATA } from './account-utils';

export async function buildBurnTransaction(
  connection: Connection,
  payer: PublicKey,
  mint: PublicKey,
  amount: bigint
): Promise<Transaction> {
  const ata = getATA(mint, payer);

  const transaction = new Transaction().add(
    createBurnInstruction(ata, mint, payer, amount, [], TOKEN_2022_PROGRAM_ID)
  );

  const { blockhash } = await connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = payer;

  return transaction;
}
