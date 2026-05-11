import { NextRequest, NextResponse } from 'next/server';
import { getFeeRevenue, addFeeRevenue } from '@/lib/db/queries';

export async function GET(req: NextRequest) {
  const mint = req.nextUrl.searchParams.get('mint');
  if (!mint) return NextResponse.json({ error: 'mint required' }, { status: 400 });

  const days = parseInt(req.nextUrl.searchParams.get('days') || '30');
  const revenue = await getFeeRevenue(mint, days);
  return NextResponse.json(revenue);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body.mintAddress || !body.feeType || body.amount === undefined) {
    return NextResponse.json({ error: 'mintAddress, feeType, and amount required' }, { status: 400 });
  }

  const result = await addFeeRevenue({
    mintAddress: body.mintAddress,
    feeType: body.feeType,
    amount: body.amount,
    signature: body.signature,
  });
  return NextResponse.json(result);
}
