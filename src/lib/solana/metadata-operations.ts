import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { TOKEN_2022_PROGRAM_ID } from '@solana/spl-token';
import { createUpdateFieldInstruction } from '@solana/spl-token-metadata';

export async function buildUpdateMetadataTransaction(
  connection: Connection,
  payer: PublicKey,
  mint: PublicKey,
  field: string,
  value: string
): Promise<Transaction> {
  const transaction = new Transaction().add(
    createUpdateFieldInstruction({
      programId: TOKEN_2022_PROGRAM_ID,
      metadata: mint,
      updateAuthority: payer,
      field,
      value,
    })
  );

  const { blockhash } = await connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = payer;

  return transaction;
}
