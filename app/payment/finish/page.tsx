import Link from 'next/link';

export default function PaymentFinishPage({ searchParams }: { searchParams: { transactionId?: string; order_id?: string } }) {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <div className="card space-y-4 p-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">Payment Finish</p>
        <h1 className="text-3xl font-bold">Pembayaran Berhasil Diproses</h1>
        <p className="text-slate-600">Terima kasih, pembayaran Anda sudah diterima oleh sistem Midtrans. Status final tetap akan disinkronkan via webhook.</p>
        <div className="rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
          <p>Transaction ID: {searchParams.transactionId || '-'}</p>
          <p>Order ID: {searchParams.order_id || '-'}</p>
        </div>
        <div className="flex justify-center gap-3">
          <Link href="/transaksi" className="rounded-lg bg-slate-900 px-4 py-2 text-white">Lihat Transaksi</Link>
          <Link href="/" className="rounded-lg border px-4 py-2">Kembali ke Beranda</Link>
        </div>
      </div>
    </main>
  );
}
