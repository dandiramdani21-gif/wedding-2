import { prisma } from '@/lib/prisma';
import { BookingForm } from '@/components/booking-form';

export default async function BookingPage() {
  const [packages, locked] = await Promise.all([
    prisma.package.findMany({ include: { items: true } }),
    prisma.booking.findMany({
      where: {
        OR: [
          { status: 'CONFIRMED' },
          { transactions: { some: { transactionType: 'DP', status: 'PAID' } } }
        ]
      },
      select: { weddingDate: true }
    })
  ]);

  const normalized = packages.map((x) => ({
    ...x,
    total: x.items.reduce((acc, i) => acc + i.totalPrice, 0)
  }));

  return (
    <main className="mx-auto max-w-lg px-4 py-10">
      <h1 className="mb-5 text-2xl font-semibold">Booking</h1>
      <BookingForm
        packages={normalized}
        unavailableDates={locked.map((x) => x.weddingDate.toISOString().slice(0, 10))}
      />
    </main>
  );
}
