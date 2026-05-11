import { NextRequest, NextResponse } from 'next/server';
import { getPegHistory, addPegHistory } from '@/lib/db/queries';

export async function GET(req: NextRequest) {
  const mint = req.nextUrl.searchParams.get('mint');
  if (!mint) return NextResponse.json({ error: 'mint required' }, { status: 400 });

  const days = parseInt(req.nextUrl.searchParams.get('days') || '30');
  const history = await getPegHistory(mint, days);
  return NextResponse.json(history);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body.mintAddress) return NextResponse.json({ error: 'mintAddress required' }, { status: 400 });

  const result = await addPegHistory(body.mintAddress, body.price, body.deviation);
  return NextResponse.json(result);
}
