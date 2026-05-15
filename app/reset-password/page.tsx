'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);

  useEffect(() => {
    if (!token) {
      setIsValidToken(false);
      return;
    }

    // Verify token exists
    fetch(`/api/auth/verify-reset-token?token=${encodeURIComponent(token)}`)
      .then(res => res.json())
      .then(data => {
        setIsValidToken(data.valid === true);
      })
      .catch(() => setIsValidToken(false));
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Password dan konfirmasi password tidak cocok' });
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setMessage({ type: 'error', text: 'Password minimal 8 karakter' });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
      });
      const data = await res.json();

      if (res.ok) {
        setMessage({ type: 'success', text: 'Password berhasil direset. Silakan login dengan password baru Anda.' });
        setTimeout(() => router.push('/login'), 2000);
      } else {
        setMessage({ type: 'error', text: data.message || 'Terjadi kesalahan' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Gagal menghubungi server. Silakan coba lagi.' });
    }

    setLoading(false);
  }

  if (!token) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-rose-50 via-white to-sky-50 px-4 py-10">
        <div className="w-full max-w-md text-center">
          <div className="rounded-[32px] border border-red-100 bg-red-50 p-8">
            <p className="text-lg font-semibold text-red-700">Link tidak valid atau sudah kadaluarsa</p>
            <p className="mt-2 text-sm text-red-600">Silakan minta reset password kembali dari halaman login.</p>
            <Link href="/forgot-password" className="mt-4 inline-block text-sm font-semibold text-rose-500 hover:text-rose-600">
              Minta link reset password
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (isValidToken === null) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-rose-50 via-white to-sky-50 px-4 py-10">
        <div className="flex items-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-rose-500 border-t-transparent" />
          <span className="text-slate-600">Memverifikasi link...</span>
        </div>
      </main>
    );
  }

  if (isValidToken === false) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-rose-50 via-white to-sky-50 px-4 py-10">
        <div className="w-full max-w-md text-center">
          <div className="rounded-[32px] border border-red-100 bg-red-50 p-8">
            <p className="text-lg font-semibold text-red-700">Link sudah tidak valid atau kadaluarsa</p>
            <p className="mt-2 text-sm text-red-600">Silakan minta reset password kembali.</p>
            <Link href="/forgot-password" className="mt-4 inline-block text-sm font-semibold text-rose-500 hover:text-rose-600">
              Minta link reset password
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-rose-50 via-white to-sky-50 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="rounded-[32px] border border-white/60 bg-white/80 p-8 shadow-[0_20px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
              <Lock className="h-8 w-8 text-emerald-600" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-950">Reset Password</h1>
            <p className="mt-3 text-sm text-slate-500">
              Masukkan password baru untuk akun Anda.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-slate-700">
                Password Baru
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 8 karakter"
                  required
                  minLength={8}
                  className="
                    h-12 w-full rounded-2xl
                    border border-slate-200
                    bg-slate-50
                    px-4 pr-12
                    text-sm text-slate-900
                    outline-none
                    transition
                    placeholder:text-slate-400
                    focus:border-rose-400
                    focus:bg-white
                  "
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700">
                Konfirmasi Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Masukkan kembali password"
                  required
                  minLength={8}
                  className="
                    h-12 w-full rounded-2xl
                    border border-slate-200
                    bg-slate-50
                    px-4 pr-12
                    text-sm text-slate-900
                    outline-none
                    transition
                    placeholder:text-slate-400
                    focus:border-rose-400
                    focus:bg-white
                  "
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
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
                  Menyimpan...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Simpan Password Baru
                </span>
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