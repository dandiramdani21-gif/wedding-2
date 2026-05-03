import { prisma } from '@/lib/prisma';
import { formatRupiah } from '@/lib/utils';
import { getPagination } from '@/lib/pagination';
import { PaginationLinks } from '@/components/pagination-links';

export default async function TransactionsPage({ searchParams }: { searchParams: { status?: string; from?: string; to?: string; page?: string; pageSize?: string } }) {
  const { page, pageSize, skip, take } = getPagination(searchParams);
  const where = {
    ...(searchParams.status ? { status: searchParams.status as any } : {}),
    ...(searchParams.from && searchParams.to
      ? { createdAt: { gte: new Date(searchParams.from), lte: new Date(`${searchParams.to}T23:59:59`) } }
      : {})
  };

  const [rows, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      select: {
        id: true,
        orderId: true,
        transactionType: true,
        amount: true,
        status: true,
        user: {
          select: {
            name: true
          }
        },
        booking: {
          select: {
            package: {
              select: {
                name: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take
    }),
    prisma.transaction.count({ where })
  ]);

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-semibold">Semua Transaksi</h1>
      <form className="card flex flex-wrap items-end gap-2 p-4">
        <select name="status" defaultValue={searchParams.status || ''} className="rounded-lg border p-2 text-sm">
          <option value="">Semua status</option>
          <option value="PENDING">PENDING</option>
          <option value="PAID">PAID</option>
          <option value="FAILED">FAILED</option>
          <option value="EXPIRED">EXPIRED</option>
        </select>
        <input type="date" name="from" defaultValue={searchParams.from} className="rounded-lg border p-2 text-sm" />
        <input type="date" name="to" defaultValue={searchParams.to} className="rounded-lg border p-2 text-sm" />
        <button className="rounded-lg bg-slate-900 px-3 py-2 text-sm text-white">Filter</button>
      </form>
      <div className="overflow-x-auto card">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 text-left"><tr><th className="p-3">Order</th><th>User</th><th>Paket</th><th>Jenis</th><th>Jumlah</th><th>Status</th></tr></thead>
          <tbody>
            {rows.map((x) => (
              <tr key={x.id} className="border-t">
                <td className="p-3">{x.orderId}</td><td>{x.user.name}</td><td>{x.booking.package.name}</td><td>{x.transactionType}</td><td>{formatRupiah(x.amount)}</td><td>{x.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <PaginationLinks
        basePath="/admin/transactions"
        page={page}
        pageSize={pageSize}
        total={total}
        extra={{ status: searchParams.status, from: searchParams.from, to: searchParams.to }}
      />
    </div>
  );
}
