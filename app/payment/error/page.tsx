import Link from 'next/link';

export default function PaymentErrorPage({ searchParams }: { searchParams: { transactionId?: string; order_id?: string } }) {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <div className="card space-y-4 p-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-red-600">Payment Error</p>
        <h1 className="text-3xl font-bold">Terjadi Kesalahan Pembayaran</h1>
        <p className="text-slate-600">Sistem menemukan kendala saat memproses pembayaran. Coba lagi beberapa saat atau hubungi admin jika berulang.</p>
        <div className="rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
          <p>Transaction ID: {searchParams.transactionId || '-'}</p>
          <p>Order ID: {searchParams.order_id || '-'}</p>
        </div>
        <div className="flex justify-center gap-3">
          <Link href="/transaksi" className="rounded-lg bg-slate-900 px-4 py-2 text-white">Coba Bayar Lagi</Link>
          <Link href="/" className="rounded-lg border px-4 py-2">Kembali ke Beranda</Link>
        </div>
      </div>
    </main>
  );
}
