'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(formData: FormData) {
    setError('');
    setLoading(true);
    const email = String(formData.get('email'));
    const password = String(formData.get('password'));

    const result = await signIn('credentials', { email, password, redirect: false });

    if (result?.error) {
      setLoading(false);
      setError('Email atau password salah');
      return;
    }

    const sessionRes = await fetch('/api/auth/session');
    const session = await sessionRes.json();
    const role = session?.user?.role;

    setLoading(false);
    router.push(role === 'ADMIN' ? '/admin/dashboard' : '/');
    router.refresh();
  }

  return (
    <main className="mx-auto max-w-md px-4 py-10">
      <h1 className="mb-5 text-2xl font-semibold">Login</h1>
      <p className="mb-4 text-sm text-slate-600">Default admin: admin@gmail.com / 123456</p>
      <form action={submit} className="card space-y-3 p-5">
        <input name="email" type="email" placeholder="Email" required className="w-full rounded-lg border p-2" />
        <input name="password" type="password" placeholder="Password" required className="w-full rounded-lg border p-2" />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button disabled={loading} className="w-full rounded-lg bg-slate-900 p-2 text-white">{loading ? 'Memproses...' : 'Masuk'}</button>
      </form>
    </main>
  );
}
