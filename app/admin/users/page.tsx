import { prisma } from '@/lib/prisma';
import { getPagination } from '@/lib/pagination';
import { PaginationLinks } from '@/components/pagination-links';

export default async function UsersPage({ searchParams }: { searchParams: { page?: string; pageSize?: string } }) {
  const { page, pageSize, skip, take } = getPagination(searchParams);
  const [rows, total] = await Promise.all([
    prisma.user.findMany({ where: { role: 'USER' }, include: { transactions: true }, orderBy: { createdAt: 'desc' }, skip, take }),
    prisma.user.count({ where: { role: 'USER' } })
  ]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Manajemen User</h1>
      {rows.map((u) => (
        <div key={u.id} className="card p-4">
          <p className="font-semibold">{u.name} - {u.email}</p>
          <p className="text-sm text-slate-500">{u.address} · {u.phone}</p>
          <p className="mt-1 text-sm">Total transaksi: {u.transactions.length}</p>
        </div>
      ))}
      <PaginationLinks basePath="/admin/users" page={page} pageSize={pageSize} total={total} />
    </div>
  );
}
