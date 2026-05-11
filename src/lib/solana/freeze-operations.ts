import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import {
  TOKEN_2022_PROGRAM_ID,
  createFreezeAccountInstruction,
  createThawAccountInstruction,
} from '@solana/spl-token';
import { getATA } from './account-utils';

export async function buildFreezeTransaction(
  connection: Connection,
  authority: PublicKey,
  mint: PublicKey,
  targetOwner: PublicKey
): Promise<Transaction> {
  const ata = getATA(mint, targetOwner);
  const transaction = new Transaction().add(
    createFreezeAccountInstruction(ata, mint, authority, [], TOKEN_2022_PROGRAM_ID)
  );

  const { blockhash } = await connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = authority;

  return transaction;
}

export async function buildThawTransaction(
  connection: Connection,
  authority: PublicKey,
  mint: PublicKey,
  targetOwner: PublicKey
): Promise<Transaction> {
  const ata = getATA(mint, targetOwner);
  const transaction = new Transaction().add(
    createThawAccountInstruction(ata, mint, authority, [], TOKEN_2022_PROGRAM_ID)
  );

  const { blockhash } = await connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = authority;

  return transaction;
}
