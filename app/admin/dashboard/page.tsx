import { prisma } from '@/lib/prisma';
import { formatRupiah } from '@/lib/utils';
import { RevenueChart, TransactionChart } from '@/components/admin/charts';

export default async function AdminDashboard({ searchParams }: { searchParams: { from?: string; to?: string } }) {
  const from = searchParams.from;
  const to = searchParams.to;
  const where = from && to ? { createdAt: { gte: new Date(from), lte: new Date(`${to}T23:59:59`) } } : {};

  const [userCount, packageCount, transactions] = await Promise.all([
    prisma.user.count({ where: { role: 'USER' } }),
    prisma.package.count(),
    prisma.transaction.findMany({ where, include: { booking: true }, orderBy: { createdAt: 'asc' } })
  ]);

  const revenue = transactions.filter((x) => x.status === 'PAID').reduce((acc, x) => acc + x.amount, 0);

  const grouped = new Map<string, { date: string; revenue: number; transactions: number }>();
  for (const trx of transactions) {
    const key = trx.createdAt.toISOString().slice(0, 10);
    const item = grouped.get(key) || { date: key, revenue: 0, transactions: 0 };
    item.transactions += 1;
    if (trx.status === 'PAID') item.revenue += trx.amount;
    grouped.set(key, item);
  }

  const chartData = Array.from(grouped.values());

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-2xl font-semibold">Dashboard Admin</h1>
        <form className="flex flex-wrap gap-2">
          <input type="date" name="from" defaultValue={from} className="rounded-lg border p-2 text-sm" />
          <input type="date" name="to" defaultValue={to} className="rounded-lg border p-2 text-sm" />
          <button className="rounded-lg bg-slate-900 px-3 py-2 text-sm text-white">Filter</button>
          <a href={`/api/admin/dashboard?download=excel${from && to ? `&from=${from}&to=${to}` : ''}`} className="rounded-lg bg-rose-600 px-3 py-2 text-sm text-white">Download Excel</a>
        </form>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="card p-4"><p className="text-sm text-slate-500">Total Pendapatan</p><p className="text-2xl font-bold">{formatRupiah(revenue)}</p></div>
        <div className="card p-4"><p className="text-sm text-slate-500">Jumlah User</p><p className="text-2xl font-bold">{userCount}</p></div>
        <div className="card p-4"><p className="text-sm text-slate-500">Jumlah Paket</p><p className="text-2xl font-bold">{packageCount}</p></div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <RevenueChart data={chartData} />
        <TransactionChart data={chartData} />
      </div>
    </div>
  );
}
