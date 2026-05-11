import { NextRequest, NextResponse } from 'next/server';
import { getPauseHistory } from '@/lib/db/queries';

export async function GET(req: NextRequest) {
  const mint = req.nextUrl.searchParams.get('mint');
  if (!mint) return NextResponse.json({ error: 'mint required' }, { status: 400 });

  const limit = parseInt(req.nextUrl.searchParams.get('limit') || '50');
  const history = await getPauseHistory(mint, limit);
  return NextResponse.json(history);
}
