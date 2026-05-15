'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Check, X, Clock, ArrowRight } from 'lucide-react';
import { formatRupiah } from '@/lib/utils';

function PaymentResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('order_id');

  const [loading, setLoading] = useState(true);
  const [transaction, setTransaction] = useState<any>(null);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    // Check transaction status
    fetch(`/api/transactions/check-status?orderId=${encodeURIComponent(orderId)}`)
      .then(res => res.json())
      .then(data => {
        setTransaction(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [orderId]);

  // If no order ID, show "cancelled" or redirect
  if (!orderId) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f6f7fb] px-6 py-10">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-100 via-white to-orange-100" />

        <div className="relative w-full max-w-5xl overflow-hidden rounded-[40px] border border-white/60 bg-white/80 shadow-[0_20px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl">
          <div className="flex min-h-[600px] flex-col items-center justify-center px-6 text-center">
            <div className="relative">
              <div className="absolute inset-0 animate-ping rounded-full bg-amber-200 opacity-20" />
              <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-amber-100 bg-white shadow-lg">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-md">
                  <Clock className="h-8 w-8 stroke-[3]" />
                </div>
              </div>
            </div>

            <div className="mt-10 max-w-2xl">
              <p className="mb-4 inline-flex rounded-full border border-amber-100 bg-amber-50 px-4 py-2 text-sm font-semibold tracking-wide text-amber-600">
                PEMBAYARAN DIBATALKAN
              </p>

              <h1 className="text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
                Pembayaran
                <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                  {" "}Dibatalkan
                </span>
              </h1>

              <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-slate-500">
                Anda membatalkan proses pembayaran. Tidak ada transaksi yang diproses.
              </p>
            </div>

            <div className="mt-12 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/transaksi"
                className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-8 text-sm font-semibold text-white shadow-lg shadow-amber-200 transition-all hover:scale-[1.02]"
              >
                Kembali ke Transaksi
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/"
                className="inline-flex h-14 items-center justify-center rounded-2xl border border-slate-200 bg-white px-8 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Kembali ke Home
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f6f7fb] px-6 py-10">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-100 via-white to-sky-100" />
        <div className="flex items-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-rose-500 border-t-transparent" />
          <span className="text-slate-600">Memuat status pembayaran...</span>
        </div>
      </main>
    );
  }

  // Determine status and show appropriate UI
  const isSuccess = transaction?.status === 'PAID';
  const isFailed = transaction?.status === 'FAILED' || transaction?.status === 'EXPIRED';
  const isPending = transaction?.status === 'PENDING';

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f6f7fb] px-6 py-10">
      {isSuccess ? (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 via-white to-teal-100" />
          <div className="absolute left-[-120px] top-[-120px] h-[300px] w-[300px] rounded-full bg-emerald-300/30 blur-3xl" />
          <div className="absolute bottom-[-120px] right-[-120px] h-[300px] w-[300px] rounded-full bg-teal-300/30 blur-3xl" />
        </>
      ) : isFailed ? (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-red-100 via-white to-rose-100" />
          <div className="absolute left-[-120px] top-[-120px] h-[300px] w-[300px] rounded-full bg-red-300/30 blur-3xl" />
          <div className="absolute bottom-[-120px] right-[-120px] h-[300px] w-[300px] rounded-full bg-rose-300/30 blur-3xl" />
        </>
      ) : (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-amber-100 via-white to-orange-100" />
          <div className="absolute left-[-120px] top-[-120px] h-[300px] w-[300px] rounded-full bg-amber-300/30 blur-3xl" />
          <div className="absolute bottom-[-120px] right-[-120px] h-[300px] w-[300px] rounded-full bg-orange-300/30 blur-3xl" />
        </>
      )}

      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, black 1px, transparent 1px),
            linear-gradient(to bottom, black 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative w-full max-w-5xl overflow-hidden rounded-[40px] border border-white/60 bg-white/80 shadow-[0_20px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl">
        <div className="flex min-h-[700px] flex-col items-center justify-center px-6 text-center">
          {isSuccess && (
            <>
              <div className="relative">
                <div className="absolute inset-0 animate-ping rounded-full bg-emerald-200 opacity-20" />
                <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-emerald-100 bg-white shadow-lg">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-md">
                    <Check className="h-8 w-8 stroke-[3]" />
                  </div>
                </div>
              </div>

              <div className="mt-10 max-w-2xl">
                <p className="mb-4 inline-flex rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-sm font-semibold tracking-wide text-emerald-600">
                  PEMBAYARAN BERHASIL
                </p>

                <h1 className="text-5xl font-black tracking-tight text-slate-900 md:text-6xl">
                  Pembayaran
                  <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                    {" "}Berhasil
                  </span>
                </h1>

                {transaction && (
                  <div className="mx-auto mt-6 max-w-xl rounded-2xl bg-emerald-50 p-4">
                    <p className="text-sm text-emerald-700">
                      {transaction.transactionType} untuk paket <span className="font-semibold">{transaction.packageName}</span>
                    </p>
                    <p className="mt-1 text-lg font-bold text-emerald-800">{formatRupiah(transaction.amount)}</p>
                  </div>
                )}

                <p className="mx-auto mt-6 text-lg leading-8 text-slate-500">
                  Pembayaran wedding package sudah berhasil diterima.
                  Invoice dan detail transaksi akan dikirim melalui email.
                </p>
              </div>

              <div className="mt-12 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/transaksi"
                  className="inline-flex h-14 items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-8 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition-all hover:scale-[1.02]"
                >
                  Lihat Transaksi
                </Link>

                <Link
                  href="/"
                  className="inline-flex h-14 items-center justify-center rounded-2xl border border-slate-200 bg-white px-8 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Kembali ke Home
                </Link>
              </div>
            </>
          )}

          {isFailed && (
            <>
              <div className="relative">
                <div className="absolute inset-0 animate-ping rounded-full bg-red-200 opacity-20" />
                <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-red-100 bg-white shadow-lg">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-red-400 to-rose-500 text-white shadow-md">
                    <X className="h-8 w-8 stroke-[3]" />
                  </div>
                </div>
              </div>

              <div className="mt-10 max-w-2xl">
                <p className="mb-4 inline-flex rounded-full border border-red-100 bg-red-50 px-4 py-2 text-sm font-semibold tracking-wide text-red-600">
                  PEMBAYARAN GAGAL
                </p>

                <h1 className="text-5xl font-black tracking-tight text-slate-900 md:text-6xl">
                  Pembayaran
                  <span className="bg-gradient-to-r from-red-500 to-rose-500 bg-clip-text text-transparent">
                    {" "}Gagal
                  </span>
                </h1>

                <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-slate-500">
                  Pembayaran tidak berhasil diproses. Silakan coba lagi atau pilih metode pembayaran lain.
                </p>
              </div>

              <div className="mt-12 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/transaksi"
                  className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-500 to-rose-500 px-8 text-sm font-semibold text-white shadow-lg shadow-red-200 transition-all hover:scale-[1.02]"
                >
                  Kembali ke Transaksi
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/"
                  className="inline-flex h-14 items-center justify-center rounded-2xl border border-slate-200 bg-white px-8 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Kembali ke Home
                </Link>
              </div>
            </>
          )}

          {isPending && (
            <>
              <div className="relative">
                <div className="absolute inset-0 animate-ping rounded-full bg-amber-200 opacity-20" />
                <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-amber-100 bg-white shadow-lg">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-md">
                    <Clock className="h-8 w-8 stroke-[3]" />
                  </div>
                </div>
              </div>

              <div className="mt-10 max-w-2xl">
                <p className="mb-4 inline-flex rounded-full border border-amber-100 bg-amber-50 px-4 py-2 text-sm font-semibold tracking-wide text-amber-600">
                  PEMBAYARAN TERTUNDA
                </p>

                <h1 className="text-5xl font-black tracking-tight text-slate-900 md:text-6xl">
                  Pembayaran
                  <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                    {" "}Pending
                  </span>
                </h1>

                <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-slate-500">
                  Pembayaran Anda masih dalam proses. Mohon tunggu beberapa saat dan cek kembali statusnya.
                </p>
              </div>

              <div className="mt-12 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/transaksi"
                  className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-8 text-sm font-semibold text-white shadow-lg shadow-amber-200 transition-all hover:scale-[1.02]"
                >
                  Cek Status Transaksi
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/"
                  className="inline-flex h-14 items-center justify-center rounded-2xl border border-slate-200 bg-white px-8 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Kembali ke Home
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

export default function ThanksPage() {
  return (
    <Suspense fallback={
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f6f7fb] px-6 py-10">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-100 via-white to-sky-100" />
        <div className="flex items-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-rose-500 border-t-transparent" />
          <span className="text-slate-600">Memuat...</span>
        </div>
      </main>
    }>
      <PaymentResultContent />
    </Suspense>
  );
}