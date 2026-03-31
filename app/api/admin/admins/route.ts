import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminApi } from '@/lib/api-auth';
import { getPagination } from '@/lib/pagination';

export async function GET(req: Request) {
  const admin = await requireAdminApi();
  if (!admin) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const { page, pageSize, skip, take } = getPagination(new URL(req.url).searchParams);
  const [rows, total] = await Promise.all([
    prisma.admin.findMany({ include: { user: true }, orderBy: { createdAt: 'desc' }, skip, take }),
    prisma.admin.count()
  ]);
  return NextResponse.json({ rows, meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) } });
}

export async function POST(req: Request) {
  const creator = await requireAdminApi();
  if (!creator) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const ct = req.headers.get('content-type') || '';
  const body = ct.includes('application/json') ? await req.json() : Object.fromEntries((await req.formData()).entries());

  const user = await prisma.user.create({
    data: {
      name: String(body.name),
      email: String(body.email),
      passwordHash: await bcrypt.hash(String(body.password), 10),
      address: String(body.address || '-'),
      phone: String(body.phone || '-'),
      role: 'ADMIN'
    }
  });
  const admin = await prisma.admin.create({ data: { userId: user.id, createdById: creator.id } });
  if (ct.includes('application/json')) return NextResponse.json({ admin });
  return NextResponse.redirect(new URL('/admin/admins', req.url));
}

export async function DELETE(req: Request) {
  const creator = await requireAdminApi();
  if (!creator) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const id = new URL(req.url).searchParams.get('id');
  if (!id) return NextResponse.json({ message: 'id required' }, { status: 400 });
  await prisma.admin.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
