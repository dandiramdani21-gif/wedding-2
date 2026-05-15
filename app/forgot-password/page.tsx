'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();

      if (res.ok) {
        setMessage({ type: 'success', text: 'Link reset password sudah dikirim ke email Anda. Silakan cek inbox atau folder spam.' });
        setEmail('');
      } else {
        setMessage({ type: 'error', text: data.message || 'Terjadi kesalahan' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Gagal menghubungi server. Silakan coba lagi.' });
    }

    setLoading(false);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-rose-50 via-white to-sky-50 px-4 py-10">
      <div className="w-full max-w-md">
        <Link
          href="/login"
          className="mb-8 inline-flex items-center gap-2 text-sm text-slate-600 transition hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke login
        </Link>

        <div className="rounded-[32px] border border-white/60 bg-white/80 p-8 shadow-[0_20px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-rose-100">
              <Mail className="h-8 w-8 text-rose-500" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-950">Lupa Password?</h1>
            <p className="mt-3 text-sm text-slate-500">
              Masukkan email Anda dan kami akan mengirimkan link untuk mereset password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-slate-700">
                Alamat Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                required
                className="
                  h-12 w-full rounded-2xl
                  border border-slate-200
                  bg-slate-50
                  px-4
                  text-sm text-slate-900
                  outline-none
                  transition
                  placeholder:text-slate-400
                  focus:border-rose-400
                  focus:bg-white
                "
              />
            </div>

            {message && (
              <div className={`rounded-2xl border px-4 py-3 text-sm ${
                message.type === 'success'
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                  : 'border-red-200 bg-red-50 text-red-700'
              }`}>
                {message.text}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="
                flex h-12 w-full items-center justify-center
                rounded-2xl
                bg-rose-500
                text-sm font-semibold text-white
                transition
                hover:bg-rose-600
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Mengirim...
                </span>
              ) : (
                'Kirim Link Reset Password'
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Ingat password Anda?{' '}
            <Link href="/login" className="font-semibold text-rose-500 hover:text-rose-600">
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}