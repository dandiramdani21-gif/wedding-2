export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const locked = await prisma.booking.findMany({
    where: {
      OR: [
        { status: 'CONFIRMED' },
        { transactions: { some: { transactionType: 'DP', status: 'PAID' } } }
      ]
    },
    select: { weddingDate: true }
  });

  return NextResponse.json({ dates: locked.map((x) => x.weddingDate.toISOString().slice(0, 10)) });
}
