import { prisma } from '@/lib/prisma';
import { BookingForm } from '@/components/booking-form';

export default async function BookingPage({ searchParams }: { searchParams: { packageId?: string } }) {
  const [packages, locked] = await Promise.all([
    prisma.package.findMany({ include: { items: true }, orderBy: { createdAt: 'desc' } }),
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
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6">
        <p className="text-sm uppercase tracking-wide text-slate-500">Booking Experience</p>
        <h1 className="text-3xl font-bold">Pilih Paket & Jadwal Resepsi Anda</h1>
      </div>
      <BookingForm
        packages={normalized}
        unavailableDates={locked.map((x) => x.weddingDate.toISOString().slice(0, 10))}
        initialPackageId={searchParams.packageId}
      />
    </main>
  );
}
