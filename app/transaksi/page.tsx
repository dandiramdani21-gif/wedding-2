import { requireAuth } from '@/lib/rbac';
import { prisma } from '@/lib/prisma';
import { formatRupiah } from '@/lib/utils';

export default async function TransaksiPage() {
  const session = await requireAuth();
  const rows = await prisma.transaction.findMany({
    where: { userId: (session.user as any).id },
    include: { booking: { include: { package: true } } },
    orderBy: { createdAt: 'desc' }
  });

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
    </main>
  );
}
