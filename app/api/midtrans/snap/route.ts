import { NextResponse } from 'next/server';
import { snap } from '@/lib/midtrans';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get('transactionId');
  if (!id) return NextResponse.json({ message: 'transactionId wajib' }, { status: 400 });

  const trx = await prisma.transaction.findUnique({
    where: { id },
    include: { user: true, payment: true }
  });
  if (!trx) return NextResponse.json({ message: 'Transaksi tidak ditemukan' }, { status: 404 });

  const baseUrl = process.env.NEXTAUTH_URL || `${url.protocol}//${url.host}`;

  const snapTx = await snap.createTransaction({
    transaction_details: {
      order_id: trx.orderId,
      gross_amount: trx.amount
    },
    customer_details: {
      first_name: trx.user.name,
      email: trx.user.email,
      phone: trx.user.phone
    },
    callbacks: {
      finish: `${baseUrl}/payment/finish?transactionId=${trx.id}`,
      unfinish: `${baseUrl}/payment/unfinish?transactionId=${trx.id}`,
      error: `${baseUrl}/payment/error?transactionId=${trx.id}`
    }
  });

  await prisma.payment.upsert({
    where: { transactionId: trx.id },
    update: { midtransToken: snapTx.token, midtransRedirect: snapTx.redirect_url },
    create: { transactionId: trx.id, midtransToken: snapTx.token, midtransRedirect: snapTx.redirect_url }
  });

  return NextResponse.redirect(snapTx.redirect_url);
}
