import { NextRequest, NextResponse } from 'next/server';
import { getLiquidityConfig, upsertLiquidityConfig } from '@/lib/db/queries';

export async function GET(req: NextRequest) {
  const mint = req.nextUrl.searchParams.get('mint');
  if (!mint) return NextResponse.json({ error: 'mint required' }, { status: 400 });

  const config = await getLiquidityConfig(mint);
  return NextResponse.json(config ?? { totalLiquidity: 0, reserveTarget: 100, collateralRatio: 1.0, reserveBalance: 0 });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body.mintAddress) return NextResponse.json({ error: 'mintAddress required' }, { status: 400 });

  const { mintAddress, ...data } = body;
  const result = await upsertLiquidityConfig(mintAddress, data);
  return NextResponse.json(result);
}
