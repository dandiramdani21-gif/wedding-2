import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { buildOrderId } from '@/lib/midtrans';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/login');

  const form = await req.formData();
  const packageId = String(form.get('packageId'));
  const weddingDate = new Date(String(form.get('weddingDate')));

  const pkg = await prisma.package.findUnique({ where: { id: packageId }, include: { items: true } });
  if (!pkg) return new Response('Paket tidak ditemukan', { status: 404 });

  const lockedDate = await prisma.booking.findFirst({
    where: {
      weddingDate,
      OR: [
        { status: 'CONFIRMED' },
        { transactions: { some: { transactionType: 'DP', status: 'PAID' } } }
      ]
    }
  });

  if (lockedDate) return new Response('Tanggal sudah dibooking dan DP sudah dibayar. Pilih tanggal lain.', { status: 400 });

  const totalAmount = pkg.items.reduce((a, b) => a + b.totalPrice, 0);
  const dpAmount = Math.round(totalAmount * 0.3);

  const booking = await prisma.booking.create({
    data: {
      userId: (session.user as any).id,
      packageId,
      weddingDate,
      totalAmount,
      dpAmount
    }
  });

  await prisma.transaction.create({
    data: {
      userId: (session.user as any).id,
      bookingId: booking.id,
      transactionType: 'DP',
      amount: dpAmount,
      orderId: buildOrderId('DP', booking.id)
    }
  });

  redirect('/transaksi');
}
