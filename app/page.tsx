import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { PackageCard } from '@/components/package-card';
import { getPagination } from '@/lib/pagination';
import { PaginationLinks } from '@/components/pagination-links';
import { withPackageTotals } from '@/lib/package-data';

export default async function HomePage({ searchParams }: { searchParams: { page?: string; pageSize?: string } }) {
  const { page, pageSize, skip, take } = getPagination(searchParams, 6);
  const [rows, total] = await Promise.all([
    prisma.package.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        imageUrl: true,
        items: {
          select: {
            id: true,
            itemName: true,
            quantity: true,
            unitPrice: true,
            totalPrice: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take
    }),
    prisma.package.count()
  ]);
  const packages = withPackageTotals(rows);

  return (
    <main>
      <section className="relative isolate -mt-[72px] overflow-hidden px-0 pb-16 pt-[132px] text-white min-h-screen md:pt-[148px]">
        <video
          className="absolute inset-0 -z-20 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        >
          <source src="/background.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 -z-10 bg-slate-950/55" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(244,63,94,0.18),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(15,23,42,0.3),_transparent_38%)]" />

        <div className="mx-auto flex min-h-[calc(100vh-132px)] max-w-6xl items-end px-4 md:min-h-[calc(100vh-148px)]">
          <div className="max-w-3xl">
            <p className="mb-3 text-sm uppercase tracking-[0.2em] text-white/80">Seven Party Decor</p>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">Selamat datang di Party Planner Bandung</h1>
            <p className="mt-4 text-lg text-white/90">Wujudkan dekorasi impian kamu bersama Seven Party Decor.</p>
            <div className="mt-8 flex gap-3">
              <Link href="#packages" className="rounded-xl bg-white px-5 py-3 text-slate-900">Lihat Paket</Link>
              <Link href="/booking" className="rounded-xl border border-white px-5 py-3">Mulai Booking</Link>
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
