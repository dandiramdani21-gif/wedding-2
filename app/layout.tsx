import './globals.css';
import type { ReactNode } from 'react';
import { Providers } from '@/components/providers';
import { Navbar } from '@/components/navbar';

export const metadata = {
  title: 'Wedding Decoration Booking',
  description: 'Platform booking dekorasi pernikahan'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id">
      <body>
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
