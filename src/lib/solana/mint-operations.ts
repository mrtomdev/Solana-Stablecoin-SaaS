import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import {
  TOKEN_2022_PROGRAM_ID,
  createMintToInstruction,
  createAssociatedTokenAccountInstruction,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { getATA, ataExists } from './account-utils';

export async function buildMintTransaction(
  connection: Connection,
  payer: PublicKey,
  mint: PublicKey,
  destination: PublicKey,
  amount: bigint
): Promise<Transaction> {
  const ata = getATA(mint, destination);
  const transaction = new Transaction();

  if (!(await ataExists(connection, ata))) {
    transaction.add(
      createAssociatedTokenAccountInstruction(
        payer,
        ata,
        destination,
        mint,
        TOKEN_2022_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      )
    );
  }

  transaction.add(
    createMintToInstruction(mint, ata, payer, amount, [], TOKEN_2022_PROGRAM_ID)
  );

  const { blockhash } = await connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = payer;

  return transaction;
}
