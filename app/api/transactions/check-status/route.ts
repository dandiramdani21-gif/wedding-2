import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  // Get order_id from query params (Midtrans sends this on redirect)
  const orderId = new URL(req.url).searchParams.get('order_id');

  if (!orderId) {
    return NextResponse.json({ error: 'Order ID not provided' }, { status: 400 });
  }

  const transaction = await prisma.transaction.findUnique({
    where: { orderId },
    select: {
      id: true,
      orderId: true,
      status: true,
      amount: true,
      transactionType: true,
      booking: {
        select: {
          package: {
            select: { name: true }
          }
        }
      }
    }
  });

  if (!transaction) {
    return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
  }

  return NextResponse.json({
    status: transaction.status,
    orderId: transaction.orderId,
    amount: transaction.amount,
    transactionType: transaction.transactionType,
    packageName: transaction.booking.package.name
  });
}