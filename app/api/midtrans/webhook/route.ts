import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const body = await req.json();
  const orderId = body.order_id as string;
  const trx = await prisma.transaction.findUnique({ where: { orderId }, include: { booking: true } });
  if (!trx) return NextResponse.json({ ok: true });

  const statusMap: Record<string, 'PENDING' | 'PAID' | 'FAILED' | 'EXPIRED'> = {
    settlement: 'PAID',
    capture: 'PAID',
    pending: 'PENDING',
    deny: 'FAILED',
    expire: 'EXPIRED',
    cancel: 'FAILED'
  };

  const nextStatus = statusMap[body.transaction_status] ?? 'PENDING';

  await prisma.transaction.update({ where: { id: trx.id }, data: { status: nextStatus } });
  await prisma.payment.updateMany({
    where: { transactionId: trx.id },
    data: {
      paymentMethod: body.payment_type,
      paidAt: nextStatus === 'PAID' ? new Date() : null,
      rawResponse: body
    }
  });

  if (nextStatus === 'PAID' && trx.transactionType === 'DP') {
    const remain = trx.booking.totalAmount - trx.booking.dpAmount;
    const existsSettlement = await prisma.transaction.findFirst({ where: { bookingId: trx.bookingId, transactionType: 'SETTLEMENT' } });
    if (!existsSettlement && remain > 0) {
      await prisma.transaction.create({
        data: {
          userId: trx.userId,
          bookingId: trx.bookingId,
          transactionType: 'SETTLEMENT',
          amount: remain,
          orderId: `SET-${trx.bookingId}-${Date.now()}`
        }
      });
    }
    await prisma.booking.update({ where: { id: trx.bookingId }, data: { status: 'CONFIRMED' } });
  }

  return NextResponse.json({ ok: true });
}
