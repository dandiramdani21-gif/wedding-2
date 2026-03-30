import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminApi } from '@/lib/api-auth';

export async function GET() {
  const admin = await requireAdminApi();
  if (!admin) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const rows = await prisma.user.findMany({
    where: { role: 'USER' },
    include: { transactions: true },
    orderBy: { createdAt: 'desc' }
  });
  return NextResponse.json({ rows });
}
