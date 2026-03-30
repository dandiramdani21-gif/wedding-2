import { prisma } from '@/lib/prisma';
import { PackageCard } from '@/components/package-card';

export default async function HomePage() {
  const packages = await prisma.package.findMany({ include: { items: true } });

  return (
    <main>
      <section className="bg-wedding bg-cover bg-center py-24 text-white">
        <div className="mx-auto max-w-6xl px-4">
          <h1 className="text-4xl md:text-5xl font-bold">Booking Dekorasi Pernikahan</h1>
          <p className="mt-4 max-w-2xl text-white/90">Desain minimalis modern untuk hari bahagia Anda. Pilih paket, tentukan tanggal, bayar DP/pelunasan online via Midtrans.</p>
          <div className="mt-6 flex gap-3">
            <a href="/register" className="rounded-xl bg-white px-4 py-2 text-slate-900">Daftar</a>
            <a href="/login" className="rounded-xl border border-white px-4 py-2">Login</a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="mb-6 text-2xl font-semibold">Paket Dekorasi</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {packages.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>
      </section>
    </main>
  );
}
