'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

type NavbarUser = {
  name?: string | null;
  email?: string | null;
  role?: string | null;
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export function NavbarShell({ user }: { user?: NavbarUser | null }) {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const transparentHero = isHome && !scrolled;

  return (
    <header
      className={cn(
        'sticky top-0 z-40 print:hidden transition-all duration-300',
        transparentHero ? 'border-transparent bg-transparent' : 'border-b bg-white/95 shadow-sm backdrop-blur'
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className={cn('font-semibold transition-colors', transparentHero ? 'text-white' : 'text-slate-900')}>
          Seven Party Decor
        </Link>

        <nav className="flex items-center gap-2 text-sm">
          <Link
            href="/"
            className={cn(
              'rounded-lg px-3 py-2 transition',
              transparentHero ? 'text-white hover:bg-white/10' : 'hover:bg-slate-100'
            )}
          >
            Halaman Utama
          </Link>
          {user?.role === 'USER' && (
            <Link
              href="/booking"
              className={cn(
                'rounded-lg px-3 py-2 transition',
                transparentHero ? 'text-white hover:bg-white/10' : 'hover:bg-slate-100'
              )}
            >
              Pesanan
            </Link>
          )}
          {user?.role === 'USER' && (
            <Link
              href="/transaksi"
              className={cn(
                'rounded-lg px-3 py-2 transition',
                transparentHero ? 'text-white hover:bg-white/10' : 'hover:bg-slate-100'
              )}
            >
              Transaksi
            </Link>
          )}
          {user?.role === 'ADMIN' && (
            <Link
              href="/admin/dashboard"
              className={cn(
                'rounded-lg px-3 py-2 transition',
                transparentHero ? 'text-white hover:bg-white/10' : 'hover:bg-slate-100'
              )}
            >
              Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <div className="hidden text-right sm:block">
                <p className={cn('text-sm font-medium transition-colors', transparentHero ? 'text-white' : 'text-slate-900')}>{user.name}</p>
                <p className={cn('text-xs transition-colors', transparentHero ? 'text-white/75' : 'text-slate-500')}>
                  {user.email} · {user.role}
                </p>
              </div>
              <form action="/api/auth/signout" method="POST">
                <button
                  className={cn(
                    'rounded-lg px-3 py-2 text-sm transition',
                    transparentHero ? 'bg-white/12 text-white hover:bg-white/20' : 'bg-slate-900 text-white'
                  )}
                >
                  Logout
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className={cn(
                  'rounded-lg px-3 py-2 text-sm transition',
                  transparentHero ? 'border border-white/20 text-white hover:bg-white/10' : 'border text-slate-900'
                )}
              >
                Login
              </Link>
              <Link href="/register" className="rounded-lg bg-rose-600 px-3 py-2 text-sm text-white transition hover:bg-rose-500">
                Daftar
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
