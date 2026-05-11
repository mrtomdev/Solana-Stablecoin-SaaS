import { NextRequest, NextResponse } from 'next/server';
import { logAdminAction, getAdminActions } from '@/lib/db/queries';
import { AdminActionType } from '@/lib/types';

export async function GET(req: NextRequest) {
  const mintAddress = req.nextUrl.searchParams.get('mint');
  if (!mintAddress) return NextResponse.json({ error: 'mint required' }, { status: 400 });

  const limit = parseInt(req.nextUrl.searchParams.get('limit') || '50');
  const offset = parseInt(req.nextUrl.searchParams.get('offset') || '0');

  const actions = await getAdminActions(mintAddress, limit, offset);
  return NextResponse.json(actions);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { mintAddress, action, signature, details, walletAddress, status } = body;

    if (!mintAddress || !action || !walletAddress) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const record = await logAdminAction({
      mintAddress,
      action: action as AdminActionType,
      signature,
      details,
      walletAddress,
      status,
    });

    return NextResponse.json(record);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
