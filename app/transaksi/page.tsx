import { requireAuth } from '@/lib/rbac';
import { prisma } from '@/lib/prisma';
import { formatRupiah } from '@/lib/utils';
import { getPagination } from '@/lib/pagination';
import { PaginationLinks } from '@/components/pagination-links';

export default async function TransaksiPage({ searchParams }: { searchParams: { page?: string; pageSize?: string } }) {
  const session = await requireAuth();
  const { page, pageSize, skip, take } = getPagination(searchParams);
  const where = { userId: (session.user as any).id };
  const [rows, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      include: { booking: { include: { package: true } } },
      orderBy: { createdAt: 'desc' },
      skip,
      take
    }),
    prisma.transaction.count({ where })
  ]);

  return (
<main className="mx-auto max-w-5xl px-4 py-10">
  <h1 className="mb-6 text-2xl font-semibold tracking-tight">Transaksi Saya</h1>

  <div className="grid gap-4">
    {rows.map((row) => (
      <div
        key={row.id}
        className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
      >
        <div className="flex items-start justify-between gap-4">
          {/* LEFT */}
          <div className="space-y-1">
            <p className="text-base font-semibold text-slate-900">
              {row.booking.package.name}
            </p>

            <p className="text-sm text-slate-500">
              {row.transactionType}
            </p>

            <p className="text-sm font-medium text-slate-700">
              {formatRupiah(row.amount)}
            </p>
          </div>

          {/* RIGHT */}
          <div className="flex flex-col items-end gap-2">
            {/* STATUS BADGE */}
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                row.status === "PENDING"
                  ? "bg-yellow-100 text-yellow-700"
                  : row.status === "PAID"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {row.status}
            </span>

            {/* BUTTON */}
            {row.status === "PENDING" && (
              <a
                href={`/api/midtrans/snap?transactionId=${row.id}`}
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                Bayar
              </a>
            )}
          </div>
        </div>
      </div>
    ))}
  </div>

  <div className="mt-6">
    <PaginationLinks
      basePath="/transaksi"
      page={page}
      pageSize={pageSize}
      total={total}
    />
  </div>
</main>
  );
}
