import type { ReactNode } from 'react';
import Link from 'next/link';
import { requireAdmin } from '@/lib/rbac';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  await requireAdmin();

  return (
    <main className="mx-auto grid max-w-7xl gap-6 px-4 py-6 md:grid-cols-[220px_1fr]">
      <aside className="card h-fit p-4">
        <h2 className="mb-3 text-lg font-semibold">Admin CMS</h2>
        <nav className="space-y-1 text-sm">
          <Link href="/admin/dashboard" className="block rounded-lg px-3 py-2 hover:bg-slate-100">Dashboard</Link>
          <Link href="/admin/packages" className="block rounded-lg px-3 py-2 hover:bg-slate-100">Paket</Link>
          <Link href="/admin/transactions" className="block rounded-lg px-3 py-2 hover:bg-slate-100">Transaksi</Link>
          <Link href="/admin/users" className="block rounded-lg px-3 py-2 hover:bg-slate-100">User</Link>
          <Link href="/admin/admins" className="block rounded-lg px-3 py-2 hover:bg-slate-100">Admin</Link>
        </nav>
      </aside>
      <section>{children}</section>
    </main>
  );
}
