import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getPagination } from '@/lib/pagination';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const { page, pageSize, skip, take } = getPagination(new URL(req.url).searchParams);
  const where = { userId: (session.user as any).id };
  const [rows, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take
    }),
    prisma.transaction.count({ where })
  ]);
  return NextResponse.json({ rows, meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) } });
}
