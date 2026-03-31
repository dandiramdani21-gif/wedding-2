import { prisma } from '@/lib/prisma';
import { PackageCard } from '@/components/package-card';
import { getPagination } from '@/lib/pagination';
import { PaginationLinks } from '@/components/pagination-links';

export default async function HomePage({ searchParams }: { searchParams: { page?: string; pageSize?: string } }) {
  const { page, pageSize, skip, take } = getPagination(searchParams, 6);
  const [packages, total] = await Promise.all([
    prisma.package.findMany({ include: { items: true }, orderBy: { createdAt: 'desc' }, skip, take }),
    prisma.package.count()
  ]);

  return (
    <main>
      <section className="bg-wedding bg-cover bg-center py-28 text-white">
        <div className="mx-auto max-w-6xl px-4">
          <div className="max-w-3xl">
            <p className="mb-3 text-sm uppercase tracking-[0.2em] text-white/80">Wedding Decoration</p>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">Welcome to Party Planner Bandung</h1>
            <p className="mt-4 text-lg text-white/90">Wujudkan dekorasi impian kamu bersama Seven Party Decor.</p>
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
        <div className="mt-6">
          <PaginationLinks basePath="/" page={page} pageSize={pageSize} total={total} />
        </div>
      </section>
    </main>
  );
}
