import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminApi } from '@/lib/api-auth';
import { getPagination } from '@/lib/pagination';

export async function GET(req: Request) {
  const admin = await requireAdminApi();
  if (!admin) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const url = new URL(req.url);
  const status = url.searchParams.get('status') as any;
  const from = url.searchParams.get('from');
  const to = url.searchParams.get('to');
  const { page, pageSize, skip, take } = getPagination(url.searchParams);
  const where = {
    ...(status ? { status } : {}),
    ...(from && to ? { createdAt: { gte: new Date(from), lte: new Date(`${to}T23:59:59`) } } : {})
  };

  const [rows, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      include: { user: true, booking: { include: { package: true } } },
      orderBy: { createdAt: 'desc' },
      skip,
      take
    }),
    prisma.transaction.count({ where })
  ]);

  return NextResponse.json({ rows, meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) } });
}

export async function PATCH(req: Request) {
  const admin = await requireAdminApi();
  if (!admin) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const updated = await prisma.transaction.update({ where: { id: body.id }, data: { status: body.status } });
  return NextResponse.json({ updated });
}
