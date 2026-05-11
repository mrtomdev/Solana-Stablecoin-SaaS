import { NextRequest, NextResponse } from 'next/server';
import { PublicKey } from '@solana/web3.js';
import { TOKEN_2022_PROGRAM_ID } from '@solana/spl-token';
import { getConnection } from '@/lib/solana/connection';

let cache: { data: any; timestamp: number; mint: string } | null = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function GET(req: NextRequest) {
  const mintAddress = req.nextUrl.searchParams.get('mint');
  if (!mintAddress) return NextResponse.json({ error: 'mint required' }, { status: 400 });

  if (cache && cache.mint === mintAddress && Date.now() - cache.timestamp < CACHE_TTL) {
    return NextResponse.json(cache.data);
  }

  try {
    const connection = getConnection();
    const mint = new PublicKey(mintAddress);

    const accounts = await connection.getProgramAccounts(TOKEN_2022_PROGRAM_ID, {
      filters: [
        { dataSize: 182 }, // Token account size for Token-2022
        { memcmp: { offset: 0, bytes: mint.toBase58() } },
      ],
    });

    const holders = accounts
      .map((a) => {
        const data = a.account.data;
        const amount = data.readBigUInt64LE(64);
        return {
          tokenAccount: a.pubkey.toBase58(),
          owner: new PublicKey(data.subarray(32, 64)).toBase58(),
          balance: amount.toString(),
        };
      })
      .filter((h) => BigInt(h.balance) > BigInt(0));

    const result = { holders, count: holders.length };
    cache = { data: result, timestamp: Date.now(), mint: mintAddress };
    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
