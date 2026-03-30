import { prisma } from '@/lib/prisma';
import { PackageCard } from '@/components/package-card';

export default async function HomePage() {
  const packages = await prisma.package.findMany({ include: { items: true } });

  return (
    <main>
      <section className="bg-wedding bg-cover bg-center py-28 text-white">
        <div className="mx-auto max-w-6xl px-4">
          <div className="max-w-3xl">
            <p className="mb-3 text-sm uppercase tracking-[0.2em] text-white/80">Wedding Decoration</p>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">Welcome to Wedding Booking Experience</h1>
            <p className="mt-4 text-lg text-white/90">Pilih paket dekorasi, booking tanggal resepsi, bayar DP dan pelunasan online dengan pengalaman seperti e-commerce modern.</p>
            <div className="mt-8 flex gap-3">
              <a href="#packages" className="rounded-xl bg-white px-5 py-3 text-slate-900">Lihat Paket</a>
              <a href="/booking" className="rounded-xl border border-white px-5 py-3">Mulai Booking</a>
            </div>
          </div>
        </div>
      </section>

      <section id="packages" className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-6 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-3xl font-semibold">Paket Dekorasi</h2>
            <p className="mt-1 text-slate-600">Total harga paket dihitung otomatis dari item paket.</p>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>
      </section>
    </main>
  );
}
