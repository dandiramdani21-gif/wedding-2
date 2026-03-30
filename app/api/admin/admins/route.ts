import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const rows = await prisma.admin.findMany({ include: { user: true } });
  return NextResponse.json({ rows });
}

export async function POST(req: Request) {
  const body = await req.json();
  const user = await prisma.user.create({
    data: {
      name: body.name,
      email: body.email,
      passwordHash: await bcrypt.hash(body.password, 10),
      address: body.address || '-',
      phone: body.phone || '-',
      role: 'ADMIN'
    }
  });
  const admin = await prisma.admin.create({ data: { userId: user.id, createdById: body.createdById } });
  return NextResponse.json({ admin });
}

export async function DELETE(req: Request) {
  const id = new URL(req.url).searchParams.get('id');
  if (!id) return NextResponse.json({ message: 'id required' }, { status: 400 });
  await prisma.admin.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
