import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const rows = await prisma.package.findMany({ include: { items: true } });
  return NextResponse.json({ rows });
}

export async function POST(req: Request) {
  const body = await req.json();
  const pkg = await prisma.package.create({
    data: {
      name: body.name,
      description: body.description,
      imageUrl: body.imageUrl,
      items: {
        create: (body.items || []).map((item: any) => ({
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
