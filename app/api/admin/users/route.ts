import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminApi } from '@/lib/api-auth';
import { getPagination } from '@/lib/pagination';

export async function GET(req: Request) {
  const admin = await requireAdminApi();
  if (!admin) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const { page, pageSize, skip, take } = getPagination(new URL(req.url).searchParams);
  const [rows, total] = await Promise.all([
    prisma.user.findMany({
      where: { role: 'USER' },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        phone: true,
        _count: {
          select: {
            transactions: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take
    }),
    prisma.user.count({ where: { role: 'USER' } })
  ]);
  return NextResponse.json({ rows, meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) } });
}
