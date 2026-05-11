import { NextRequest, NextResponse } from 'next/server';
import { getCircuitBreakerConfig, upsertCircuitBreakerConfig } from '@/lib/db/queries';

export async function GET(req: NextRequest) {
  const mint = req.nextUrl.searchParams.get('mint');
  if (!mint) return NextResponse.json({ error: 'mint required' }, { status: 400 });

  const config = await getCircuitBreakerConfig(mint);
  return NextResponse.json(config ?? { supplyChangeThreshold: 10, timeWindowMinutes: 60, autoPauseEnabled: false });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body.mintAddress) return NextResponse.json({ error: 'mintAddress required' }, { status: 400 });

  const result = await upsertCircuitBreakerConfig(body.mintAddress, {
    supplyChangeThreshold: body.supplyChangeThreshold,
    timeWindowMinutes: body.timeWindowMinutes,
    autoPauseEnabled: body.autoPauseEnabled,
  });
  return NextResponse.json(result);
}
