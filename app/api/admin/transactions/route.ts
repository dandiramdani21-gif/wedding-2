import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminApi } from '@/lib/api-auth';

export async function GET(req: Request) {
  const admin = await requireAdminApi();
  if (!admin) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const url = new URL(req.url);
  const status = url.searchParams.get('status') as any;
  const from = url.searchParams.get('from');
  const to = url.searchParams.get('to');

  const rows = await prisma.transaction.findMany({
    where: {
      ...(status ? { status } : {}),
      ...(from && to ? { createdAt: { gte: new Date(from), lte: new Date(`${to}T23:59:59`) } } : {})
    },
    include: { user: true, booking: { include: { package: true } } },
    orderBy: { createdAt: 'desc' }
  });

  return NextResponse.json({ rows });
}

export async function PATCH(req: Request) {
  const admin = await requireAdminApi();
  if (!admin) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const updated = await prisma.transaction.update({ where: { id: body.id }, data: { status: body.status } });
  return NextResponse.json({ updated });
}
