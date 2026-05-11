import { NextRequest, NextResponse } from 'next/server';
import { PublicKey } from '@solana/web3.js';
import { getMint, TOKEN_2022_PROGRAM_ID } from '@solana/spl-token';
import { getConnection } from '@/lib/solana/connection';

export async function GET(req: NextRequest) {
  const mintAddress = req.nextUrl.searchParams.get('mint');
  if (!mintAddress) return NextResponse.json({ error: 'mint required' }, { status: 400 });

  try {
    const connection = getConnection();
    const mint = new PublicKey(mintAddress);
    const mintInfo = await getMint(connection, mint, undefined, TOKEN_2022_PROGRAM_ID);

    return NextResponse.json({
      mintAddress: mint.toBase58(),
      supply: mintInfo.supply.toString(),
      decimals: mintInfo.decimals,
      mintAuthority: mintInfo.mintAuthority?.toBase58() ?? null,
      freezeAuthority: mintInfo.freezeAuthority?.toBase58() ?? null,
      isInitialized: mintInfo.isInitialized,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
