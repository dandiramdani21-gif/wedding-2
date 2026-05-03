// app/payment/success/page.tsx

import Link from "next/link";
import { Check } from "lucide-react";

export default function PaymentSuccessPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f6f7fb] px-6 py-10">
      {/* BACKGROUND GRADIENT */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-100 via-white to-sky-100" />

      {/* GLOW */}
      <div className="absolute left-[-120px] top-[-120px] h-[300px] w-[300px] rounded-full bg-pink-300/30 blur-3xl" />
      <div className="absolute bottom-[-120px] right-[-120px] h-[300px] w-[300px] rounded-full bg-blue-300/30 blur-3xl" />

      {/* GRID */}
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

      {/* CARD */}
      <div className="relative w-full max-w-5xl overflow-hidden rounded-[40px] border border-white/60 bg-white/80 shadow-[0_20px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl">
        {/* CONTENT */}
        <div className="flex min-h-[700px] flex-col items-center justify-center px-6 text-center">
          {/* SUCCESS ICON */}
          <div className="relative">
            {/* pulse */}
            <div className="absolute inset-0 animate-ping rounded-full bg-rose-200 opacity-20" />

            <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-rose-100 bg-white shadow-lg">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-rose-400 to-pink-500 text-white shadow-md">
                <Check className="h-8 w-8 stroke-[3]" />
              </div>
            </div>
          </div>

          {/* TEXT */}
          <div className="mt-10 max-w-2xl">
            <p className="mb-4 inline-flex rounded-full border border-rose-100 bg-rose-50 px-4 py-2 text-sm font-semibold tracking-wide text-rose-500">
              PAYMENT SUCCESS
            </p>

            <h1 className="text-5xl font-black tracking-tight text-slate-900 md:text-6xl">
              Pembayaran
              <span className="bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
                {" "}
                Berhasil
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-slate-500">
              Pembayaran wedding package kamu sudah berhasil diterima.
              Invoice dan detail transaksi akan dikirim melalui email.
              Peradaban digital akhirnya melakukan tugasnya dengan benar.
            </p>
          </div>

          {/* BUTTONS */}
          <div className="mt-12 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/transaksi"
              className="inline-flex h-14 items-center justify-center rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 px-8 text-sm font-semibold text-white shadow-lg shadow-rose-200 transition-all hover:scale-[1.02]"
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
        </div>
      </div>
    </main>
  );
}