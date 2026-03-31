import { withAuth } from 'next-auth/middleware';

export default withAuth(
  function middleware() {},
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;
        if (pathname.startsWith('/admin')) return token?.role === 'ADMIN';
        if (pathname.startsWith('/booking') || pathname.startsWith('/transaksi')) return !!token;
        return true;
      }
    },
    pages: {
      signIn: '/login'
    }
  }
);

export const config = {
  matcher: ['/admin/:path*', '/booking', '/transaksi']
};
