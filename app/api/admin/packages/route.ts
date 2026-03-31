import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminApi } from '@/lib/api-auth';
import { getPagination } from '@/lib/pagination';

export async function GET(req: Request) {
  const admin = await requireAdminApi();
  if (!admin) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const params = new URL(req.url).searchParams;
  const { page, pageSize, skip, take } = getPagination(params);
  const [rows, total] = await Promise.all([
    prisma.package.findMany({ include: { items: true }, orderBy: { createdAt: 'desc' }, skip, take }),
    prisma.package.count()
  ]);
  return NextResponse.json({ rows, meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) } });
}

export async function POST(req: Request) {
  const admin = await requireAdminApi();
  if (!admin) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const data = await req.json();
  const pkg = await prisma.package.create({
    data: {
      name: data.name,
      description: data.description,
      imageUrl: data.imageUrl,
      items: {
        create: (data.items || []).map((item: any) => ({
          itemName: item.itemName,
          quantity: Number(item.quantity),
          unitPrice: Number(item.unitPrice),
          totalPrice: Number(item.quantity) * Number(item.unitPrice)
        }))
      }
    },
    include: { items: true }
  });

  return NextResponse.json({ pkg });
}

export async function PATCH(req: Request) {
  const admin = await requireAdminApi();
  if (!admin) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const data = await req.json();
  if (!data.id) return NextResponse.json({ message: 'id required' }, { status: 400 });

  const updated = await prisma.package.update({
    where: { id: data.id },
    data: {
      name: data.name,
      description: data.description,
      imageUrl: data.imageUrl,
      items: {
        deleteMany: {},
        create: (data.items || []).map((item: any) => ({
          itemName: item.itemName,
          quantity: Number(item.quantity),
          unitPrice: Number(item.unitPrice),
          totalPrice: Number(item.quantity) * Number(item.unitPrice)
        }))
      }
    },
    include: { items: true }
  });

  return NextResponse.json({ updated });
}

export async function DELETE(req: Request) {
  const admin = await requireAdminApi();
  if (!admin) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const id = new URL(req.url).searchParams.get('id');
  if (!id) return NextResponse.json({ message: 'id required' }, { status: 400 });

  await prisma.package.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
