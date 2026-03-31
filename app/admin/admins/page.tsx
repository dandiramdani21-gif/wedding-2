import { prisma } from '@/lib/prisma';
import { getPagination } from '@/lib/pagination';
import { PaginationLinks } from '@/components/pagination-links';

export default async function AdminsPage({ searchParams }: { searchParams: { page?: string; pageSize?: string } }) {
  const { page, pageSize, skip, take } = getPagination(searchParams);
  const [rows, total] = await Promise.all([
    prisma.admin.findMany({ include: { user: true }, orderBy: { createdAt: 'desc' }, skip, take }),
    prisma.admin.count()
  ]);

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-semibold">Management Admin</h1>
      <form action="/api/admin/admins" method="POST" className="card grid gap-3 p-4 md:grid-cols-2">
        <input name="name" placeholder="Nama admin" className="rounded-lg border p-2" required />
        <input name="email" placeholder="Email admin" type="email" className="rounded-lg border p-2" required />
        <input name="password" placeholder="Password" type="password" className="rounded-lg border p-2" required />
        <input name="address" placeholder="Alamat" className="rounded-lg border p-2" />
        <input name="phone" placeholder="Telepon" className="rounded-lg border p-2" />
        <button className="rounded-lg bg-slate-900 px-3 py-2 text-white md:col-span-2">Tambah Admin</button>
      </form>

      <div className="space-y-3">
        {rows.map((a) => <div key={a.id} className="card p-4"><p className="font-semibold">{a.user.name}</p><p className="text-sm text-slate-500">{a.user.email}</p></div>)}
      </div>
      <PaginationLinks basePath="/admin/admins" page={page} pageSize={pageSize} total={total} />
    </div>
  );
}
