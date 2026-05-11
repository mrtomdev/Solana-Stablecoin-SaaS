import { NextRequest, NextResponse } from 'next/server';
import { getSupplySnapshots } from '@/lib/db/queries';

export async function GET(req: NextRequest) {
  const mintAddress = req.nextUrl.searchParams.get('mint');
  if (!mintAddress) return NextResponse.json({ error: 'mint required' }, { status: 400 });

  const days = parseInt(req.nextUrl.searchParams.get('days') || '30');
  const snapshots = await getSupplySnapshots(mintAddress, days);

  return NextResponse.json(
    snapshots.map((s) => ({
      timestamp: s.timestamp.toISOString(),
      supply: parseFloat(s.supply),
      holders: s.holders,
    }))
  );
}
