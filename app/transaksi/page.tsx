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
      <h1 className="mb-5 text-2xl font-semibold">Transaksi Saya</h1>
      <div className="space-y-3">
        {rows.map((row) => (
          <div key={row.id} className="card flex items-center justify-between p-4">
            <div>
              <p className="font-medium">{row.booking.package.name} - {row.transactionType}</p>
              <p className="text-sm text-slate-600">{formatRupiah(row.amount)} · {row.status}</p>
            </div>
            {row.status === 'PENDING' && <a href={`/api/midtrans/snap?transactionId=${row.id}`} className="rounded-lg bg-slate-900 px-3 py-2 text-white">Bayar</a>}
          </div>
        ))}
      </div>
      <div className="mt-4">
        <PaginationLinks basePath="/transaksi" page={page} pageSize={pageSize} total={total} />
      </div>
    </main>
  );
}
