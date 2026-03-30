import { prisma } from '@/lib/prisma';
import { formatRupiah } from '@/lib/utils';

export default async function BookingPage({ searchParams }: { searchParams: { packageId?: string } }) {
  const packages = await prisma.package.findMany({ include: { items: true } });

  return (
    <main className="mx-auto max-w-lg px-4 py-10">
      <h1 className="mb-5 text-2xl font-semibold">Booking</h1>
      <form action="/api/bookings" method="POST" className="card space-y-3 p-5">
        <select name="packageId" defaultValue={searchParams.packageId} className="w-full rounded-lg border p-2" required>
          <option value="">Pilih paket</option>
          {packages.map((pkg) => (
            <option key={pkg.id} value={pkg.id}>{pkg.name} - {formatRupiah(pkg.items.reduce((acc: number, item) => acc + item.totalPrice, 0))}</option>
          ))}
        </select>
        <input type="date" name="weddingDate" required className="w-full rounded-lg border p-2" />
        <button className="w-full rounded-lg bg-rose-600 p-2 text-white">Buat Booking (DP)</button>
      </form>
    </main>
  );
}
