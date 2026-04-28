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

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

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
    <main className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="w-full max-w-md">
        {/* heading */}
        <div className="mb-8 space-y-2 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">
            Selamat Datang
          </h1>

          <p className="text-sm text-neutral-500">
            Login untuk melanjutkan
          </p>
        </div>

        {/* card */}
        <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
          <form action={submit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">
                Email
              </label>

              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                className="
                  h-12 w-full rounded-2xl
                  border border-neutral-200
                  bg-neutral-50
                  px-4
                  text-sm text-neutral-900
                  outline-none
                  transition
                  placeholder:text-neutral-400
                  focus:border-neutral-400
                  focus:bg-white
                "
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">
                Password
              </label>

              <input
                name="password"
                type="password"
                placeholder="••••••••"
                required
                className="
                  h-12 w-full rounded-2xl
                  border border-neutral-200
                  bg-neutral-50
                  px-4
                  text-sm text-neutral-900
                  outline-none
                  transition
                  placeholder:text-neutral-400
                  focus:border-neutral-400
                  focus:bg-white
                "
              />
            </div>

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              disabled={loading}
              className="
                flex h-12 w-full items-center justify-center
                rounded-2xl
                bg-neutral-900
                text-sm font-medium text-white
                transition
                hover:bg-neutral-800
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Memproses...
                </div>
              ) : (
                'Masuk'
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}