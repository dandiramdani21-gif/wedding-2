import { prisma } from '@/lib/prisma';
import { PackageForm } from '@/components/admin/package-form';
import { getPagination } from '@/lib/pagination';
import { PaginationLinks } from '@/components/pagination-links';
import { withPackageTotals } from '@/lib/package-data';

export default async function PackagesPage({ searchParams }: { searchParams: { page?: string; pageSize?: string } }) {
  const { page, pageSize, skip, take } = getPagination(searchParams);
  const [packages, total] = await Promise.all([
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

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-semibold">Manajemen Paket</h1>
      <PackageForm initial={withPackageTotals(packages)} />
      <PaginationLinks basePath="/admin/packages" page={page} pageSize={pageSize} total={total} />
    </div>
  );
}
