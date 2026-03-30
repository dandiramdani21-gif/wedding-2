import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/rbac';
import { formatRupiah } from '@/lib/utils';

export default async function AdminDashboard() {
  await requireAdmin();
  const [users, packages, aggregate] = await Promise.all([
    prisma.user.count({ where: { role: 'USER' } }),
    prisma.package.count(),
    prisma.transaction.aggregate({ where: { status: 'PAID' }, _sum: { amount: true } })
  ]);

  const revenue = aggregate._sum.amount ?? 0;

  return (
    <main className="mx-auto max-w-6xl p-6">
      <h1 className="mb-6 text-2xl font-semibold">Dashboard Admin</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="card p-4"><p className="text-slate-500">Total Pendapatan</p><p className="text-2xl font-bold">{formatRupiah(revenue)}</p></div>
        <div className="card p-4"><p className="text-slate-500">Jumlah User</p><p className="text-2xl font-bold">{users}</p></div>
        <div className="card p-4"><p className="text-slate-500">Jumlah Paket</p><p className="text-2xl font-bold">{packages}</p></div>
      </div>
      <div className="mt-5 flex gap-3">
        <a className="rounded-lg bg-slate-900 px-3 py-2 text-white" href="/api/admin/dashboard?download=excel">Download Excel</a>
      </div>
    </main>
  );
}
