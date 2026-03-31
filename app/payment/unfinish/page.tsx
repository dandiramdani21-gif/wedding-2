import Link from 'next/link';

export default function PaymentUnfinishPage({ searchParams }: { searchParams: { transactionId?: string; order_id?: string } }) {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <div className="card space-y-4 p-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-amber-600">Payment Unfinish</p>
        <h1 className="text-3xl font-bold">Pembayaran Belum Selesai</h1>
        <p className="text-slate-600">Transaksi Anda belum selesai. Silakan lanjutkan pembayaran dari halaman transaksi agar booking tidak expired.</p>
        <div className="rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
          <p>Transaction ID: {searchParams.transactionId || '-'}</p>
          <p>Order ID: {searchParams.order_id || '-'}</p>
        </div>
        <div className="flex justify-center gap-3">
          <Link href="/transaksi" className="rounded-lg bg-rose-600 px-4 py-2 text-white">Lanjutkan Pembayaran</Link>
          <Link href="/" className="rounded-lg border px-4 py-2">Kembali ke Beranda</Link>
        </div>
      </div>
    </main>
  );
}
