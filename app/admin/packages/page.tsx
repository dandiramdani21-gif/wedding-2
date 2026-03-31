import { prisma } from '@/lib/prisma';
import { PackageForm } from '@/components/admin/package-form';

export default async function PackagesPage() {
  const rows = await prisma.package.findMany({ include: { items: true }, orderBy: { createdAt: 'desc' } });

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-semibold">Manajemen Paket</h1>
      <PackageForm initial={rows} />
    </div>
  );
}
