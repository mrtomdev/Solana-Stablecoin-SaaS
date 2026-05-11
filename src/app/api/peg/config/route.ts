import { NextRequest, NextResponse } from 'next/server';
import { getPegConfig, upsertPegConfig } from '@/lib/db/queries';

export async function GET(req: NextRequest) {
  const mint = req.nextUrl.searchParams.get('mint');
  if (!mint) return NextResponse.json({ error: 'mint required' }, { status: 400 });

  const config = await getPegConfig(mint);
  return NextResponse.json(config ?? { targetPrice: 1.0, deviationThreshold: 0.02 });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body.mintAddress) return NextResponse.json({ error: 'mintAddress required' }, { status: 400 });

  const result = await upsertPegConfig(body.mintAddress, {
    targetPrice: body.targetPrice,
    deviationThreshold: body.deviationThreshold,
  });
  return NextResponse.json(result);
}
