'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(formData: FormData) {
    setLoading(true);
    const payload = Object.fromEntries(formData.entries());
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    setLoading(false);
    if (res.ok) router.push('/login');
    else alert((await res.json()).message);
  }

  return (
    <main className="mx-auto max-w-md px-4 py-10">
      <h1 className="mb-5 text-2xl font-semibold">Registrasi</h1>
      <form action={submit} className="card space-y-3 p-5">
        <input name="name" placeholder="Nama" required className="w-full rounded-lg border p-2" />
        <input name="email" type="email" placeholder="Email" required className="w-full rounded-lg border p-2" />
        <input name="password" type="password" placeholder="Password" required className="w-full rounded-lg border p-2" />
        <input name="address" placeholder="Alamat" required className="w-full rounded-lg border p-2" />
        <input name="phone" placeholder="Telepon" required className="w-full rounded-lg border p-2" />
        <button disabled={loading} className="w-full rounded-lg bg-rose-600 p-2 text-white">{loading ? 'Menyimpan...' : 'Daftar'}</button>
      </form>
    </main>
  );
}
