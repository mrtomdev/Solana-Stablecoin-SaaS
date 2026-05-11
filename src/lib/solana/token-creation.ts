import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
} from '@solana/web3.js';
import {
  TOKEN_2022_PROGRAM_ID,
  createInitializeMintInstruction,
  getMintLen,
  ExtensionType,
  createInitializeMetadataPointerInstruction,
  TYPE_SIZE,
  LENGTH_SIZE,
} from '@solana/spl-token';
import {
  createInitializeInstruction,
  pack,
  TokenMetadata,
} from '@solana/spl-token-metadata';
import { CreateTokenParams } from '../types';

export async function buildCreateTokenTransaction(
  connection: Connection,
  payer: PublicKey,
  params: CreateTokenParams
): Promise<{ transaction: Transaction; mintKeypair: Keypair }> {
  const mintKeypair = Keypair.generate();
  const mint = mintKeypair.publicKey;

  const metadata: TokenMetadata = {
    mint,
    name: params.name,
    symbol: params.symbol,
    uri: params.uri,
    additionalMetadata: [],
    updateAuthority: payer,
  };

  const mintLen = getMintLen([ExtensionType.MetadataPointer]);
  const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(metadata).length;
  const lamports = await connection.getMinimumBalanceForRentExemption(mintLen + metadataLen);

  const transaction = new Transaction().add(
    SystemProgram.createAccount({
      fromPubkey: payer,
      newAccountPubkey: mint,
      space: mintLen,
      lamports,
      programId: TOKEN_2022_PROGRAM_ID,
    }),
    createInitializeMetadataPointerInstruction(
      mint,
      payer,
      mint, // metadata address is the mint itself
      TOKEN_2022_PROGRAM_ID
    ),
    createInitializeMintInstruction(
      mint,
      params.decimals,
      payer, // mint authority
      payer, // freeze authority
      TOKEN_2022_PROGRAM_ID
    ),
    createInitializeInstruction({
      programId: TOKEN_2022_PROGRAM_ID,
      mint,
      metadata: mint,
      name: params.name,
      symbol: params.symbol,
      uri: params.uri,
      mintAuthority: payer,
      updateAuthority: payer,
    })
  );

  const { blockhash } = await connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = payer;
  transaction.partialSign(mintKeypair);

  return { transaction, mintKeypair };
}
