import { prisma } from '@/lib/prisma';
import { formatRupiah } from '@/lib/utils';
import { PackageForm } from '@/components/admin/package-form';

export default async function PackagesPage() {
  const rows = await prisma.package.findMany({ include: { items: true }, orderBy: { createdAt: 'desc' } });

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-semibold">Manajemen Paket</h1>
      <PackageForm />

      <div className="grid gap-4 md:grid-cols-2">
        {rows.map((pkg) => {
          const total = pkg.items.reduce((acc, x) => acc + x.totalPrice, 0);
          return (
            <div key={pkg.id} className="card p-4">
              <h3 className="font-semibold">{pkg.name}</h3>
              <p className="text-sm text-slate-500">{pkg.description}</p>
              <ul className="mt-2 list-disc pl-5 text-sm text-slate-600">
                {pkg.items.map((x) => <li key={x.id}>{x.itemName} ({x.quantity}x) - {formatRupiah(x.totalPrice)}</li>)}
              </ul>
              <p className="mt-2 font-semibold text-rose-600">Total: {formatRupiah(total)}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
