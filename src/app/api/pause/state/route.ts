import { NextRequest, NextResponse } from 'next/server';
import { getPauseState, upsertPauseState, addPauseHistory } from '@/lib/db/queries';

export async function GET(req: NextRequest) {
  const mint = req.nextUrl.searchParams.get('mint');
  if (!mint) return NextResponse.json({ error: 'mint required' }, { status: 400 });

  const state = await getPauseState(mint);
  return NextResponse.json(state ?? {
    globalPause: false, mintPause: false, burnPause: false, transferPause: false, freezePause: false,
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body.mintAddress) return NextResponse.json({ error: 'mintAddress required' }, { status: 400 });

  const { mintAddress, walletAddress, reason, scope, action, ...pauseData } = body;
  const result = await upsertPauseState(mintAddress, pauseData);

  if (walletAddress && scope && action) {
    await addPauseHistory({ mintAddress, action, scope, reason, walletAddress });
  }

  return NextResponse.json(result);
}
