import { NextRequest, NextResponse } from 'next/server';
import { getFeeConfig, upsertFeeConfig } from '@/lib/db/queries';

export async function GET(req: NextRequest) {
  const mint = req.nextUrl.searchParams.get('mint');
  if (!mint) return NextResponse.json({ error: 'mint required' }, { status: 400 });

  const config = await getFeeConfig(mint);
  return NextResponse.json(config ?? {
    mintFee: 0, mintFeeEnabled: false,
    burnFee: 0, burnFeeEnabled: false,
    transferFee: 0, transferFeeEnabled: false,
    stabilityFee: 0, stabilityFeeEnabled: false,
    liquidationPenalty: 0, liquidationPenaltyEnabled: false,
    feeCollectorAddress: null,
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body.mintAddress) return NextResponse.json({ error: 'mintAddress required' }, { status: 400 });

  const result = await upsertFeeConfig(body.mintAddress, body);
  return NextResponse.json(result);
}
