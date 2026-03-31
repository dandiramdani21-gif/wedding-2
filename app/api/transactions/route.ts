import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const rows = await prisma.transaction.findMany({
    where: { userId: (session.user as any).id },
    orderBy: { createdAt: 'desc' }
  });
  return NextResponse.json({ rows });
}
