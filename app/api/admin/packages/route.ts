import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminApi } from '@/lib/api-auth';

export async function GET() {
  const admin = await requireAdminApi();
  if (!admin) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const rows = await prisma.package.findMany({ include: { items: true } });
  return NextResponse.json({ rows });
}

export async function POST(req: Request) {
  const admin = await requireAdminApi();
  if (!admin) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const ct = req.headers.get('content-type') || '';
  let data: any = {};

  if (ct.includes('application/json')) {
    data = await req.json();
  } else {
    const form = await req.formData();
    data = {
      name: String(form.get('name')),
      description: String(form.get('description') || ''),
      imageUrl: String(form.get('imageUrl') || ''),
      items: [{
        itemName: String(form.get('itemName')),
        quantity: Number(form.get('quantity')),
        unitPrice: Number(form.get('unitPrice'))
      }]
    };
  }

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

  if (ct.includes('application/json')) return NextResponse.json({ pkg });
  return NextResponse.redirect(new URL('/admin/packages', req.url));
}
