import { requireAdmin } from '@/lib/rbac';

export default async function Page() {
  await requireAdmin();
  return (
    <main className="mx-auto max-w-6xl p-6">
      <h1 className="text-2xl font-semibold mb-4">Admin Packages</h1>
      <p>Gunakan endpoint API /api/admin/packages untuk operasi CRUD dan filtering.</p>
    </main>
  );
}
