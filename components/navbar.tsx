import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function Navbar() {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;

  return (
    <header className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-semibold text-slate-900">Seven Party Decor</Link>
        <nav className="flex items-center gap-2 text-sm">
          <Link href="/" className="rounded-lg px-3 py-2 hover:bg-slate-100">Home</Link>
          {user && <Link href="/booking" className="rounded-lg px-3 py-2 hover:bg-slate-100">Booking</Link>}
          {user && <Link href="/transaksi" className="rounded-lg px-3 py-2 hover:bg-slate-100">Transaksi</Link>}
          {user?.role === 'ADMIN' && <Link href="/admin/dashboard" className="rounded-lg px-3 py-2 hover:bg-slate-100">Admin</Link>}
        </nav>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-slate-500">{user.email} · {user.role}</p>
              </div>
              <form action="/api/auth/signout" method="POST">
                <button className="rounded-lg bg-slate-900 px-3 py-2 text-sm text-white">Logout</button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="rounded-lg border px-3 py-2 text-sm">Login</Link>
              <Link href="/register" className="rounded-lg bg-rose-600 px-3 py-2 text-sm text-white">Daftar</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
