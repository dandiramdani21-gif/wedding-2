import './globals.css';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'Wedding Decoration Booking',
  description: 'Platform booking dekorasi pernikahan'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
