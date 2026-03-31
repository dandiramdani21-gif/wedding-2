# Wedding Decoration Booking

Aplikasi booking penyewaan dekorasi pernikahan berbasis Next.js 14 + Prisma + Supabase + Midtrans.

## Setup

1. Copy `.env.example` ke `.env` lalu isi kredensial.
2. Install dependencies: `npm install`
3. Generate Prisma client: `npm run prisma:generate`
4. Migrate DB: `npm run prisma:migrate`
5. Seed admin default: `npm run prisma:seed`
6. Jalankan app: `npm run dev`

## Default Admin

- Email: `admin@gmail.com`
- Password: `123456`

## Fitur

- Landing page minimalis modern dengan paket dekorasi.
- Registrasi user dengan hashing password.
- Booking paket dengan validasi tanggal bentrok.
- Pembayaran DP + pelunasan menggunakan Midtrans (Snap + webhook).
- Daftar transaksi user dengan tombol bayar.
- Dashboard admin + export Excel.
- CRUD paket, manajemen transaksi, user, admin.
- Role-based access control + protected routes.
