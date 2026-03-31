import { prisma } from '@/lib/prisma';
import { PackageForm } from '@/components/admin/package-form';
import { getPagination } from '@/lib/pagination';
import { PaginationLinks } from '@/components/pagination-links';

export default async function PackagesPage({ searchParams }: { searchParams: { page?: string; pageSize?: string } }) {
  const { page, pageSize, skip, take } = getPagination(searchParams);
  const [rows, total] = await Promise.all([
    prisma.package.findMany({ include: { items: true }, orderBy: { createdAt: 'desc' }, skip, take }),
    prisma.package.count()
  ]);

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-semibold">Manajemen Paket</h1>
      <PackageForm initial={rows} />
      <PaginationLinks basePath="/admin/packages" page={page} pageSize={pageSize} total={total} />
    </div>
  );
}
