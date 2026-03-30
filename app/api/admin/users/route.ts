import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const rows = await prisma.user.findMany({
    where: { role: 'USER' },
    include: { transactions: true },
    orderBy: { createdAt: 'desc' }
  });
  return NextResponse.json({ rows });
}
