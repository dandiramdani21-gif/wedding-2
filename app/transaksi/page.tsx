import Link from 'next/link';
import { CalendarDays, ChevronRight, CreditCard, Eye, ReceiptText, Wallet } from 'lucide-react';
import { requireAuth } from '@/lib/rbac';
import { prisma } from '@/lib/prisma';
import { formatDateLong, formatDateTime, formatRupiah } from '@/lib/utils';
import { getPagination } from '@/lib/pagination';
import { PaginationLinks } from '@/components/pagination-links';

function statusBadge(status: string) {
  if (status === 'PENDING') return 'bg-amber-100 text-amber-700 ring-amber-200';
  if (status === 'PAID') return 'bg-emerald-100 text-emerald-700 ring-emerald-200';
  return 'bg-rose-100 text-rose-700 ring-rose-200';
}

export default async function TransaksiPage({ searchParams }: { searchParams: { page?: string; pageSize?: string } }) {
  const session = await requireAuth();
  const { page, pageSize, skip, take } = getPagination(searchParams);
  const where = { userId: (session.user as any).id };
  const [rows, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      select: {
        id: true,
        orderId: true,
        amount: true,
        status: true,
        transactionType: true,
        createdAt: true,
        booking: {
          select: {
            weddingDate: true,
            totalAmount: true,
            package: {
              select: {
                name: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take
    }),
    prisma.transaction.count({ where })
  ]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <section className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-slate-950 px-6 py-8 text-white shadow-[0_25px_80px_rgba(15,23,42,0.18)] md:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(251,113,133,0.38),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.22),_transparent_28%)]" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-white/60">Payment Center</p>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Transaksi Saya</h1>
            <p className="mt-3 text-sm leading-6 text-white/72">
              Pantau status pembayaran, buka detail invoice, dan simpan bukti transaksi Anda dengan tampilan yang lebih rapi.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.2em] text-white/50">Total</p>
              <p className="mt-2 text-2xl font-semibold">{total}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.2em] text-white/50">Pending</p>
              <p className="mt-2 text-2xl font-semibold">{rows.filter((row) => row.status === 'PENDING').length}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.2em] text-white/50">Lunas</p>
              <p className="mt-2 text-2xl font-semibold">{rows.filter((row) => row.status === 'PAID').length}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-5">
        {rows.map((row) => (
          <article
            key={row.id}
            className="group overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-[0_16px_60px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_70px_rgba(15,23,42,0.09)]"
          >
            <div className="grid gap-6 p-6 lg:grid-cols-[1.3fr_0.7fr] lg:p-7">
              <div className="space-y-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">{row.orderId}</p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{row.booking.package.name}</h2>
                    <p className="mt-2 text-sm text-slate-500">Dibuat pada {formatDateTime(row.createdAt)}</p>
                  </div>
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ${statusBadge(row.status)}`}>
                    {row.status}
                  </span>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="mb-2 flex items-center gap-2 text-slate-700">
                      <CreditCard className="h-4 w-4" />
                      <span className="text-sm font-medium">Jenis Transaksi</span>
                    </div>
                    <p className="text-lg font-semibold text-slate-950">{row.transactionType}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="mb-2 flex items-center gap-2 text-slate-700">
                      <CalendarDays className="h-4 w-4" />
                      <span className="text-sm font-medium">Tanggal Acara</span>
                    </div>
                    <p className="text-lg font-semibold text-slate-950">{formatDateLong(row.booking.weddingDate)}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="mb-2 flex items-center gap-2 text-slate-700">
                      <ReceiptText className="h-4 w-4" />
                      <span className="text-sm font-medium">Total Paket</span>
                    </div>
                    <p className="text-lg font-semibold text-slate-950">{formatRupiah(row.booking.totalAmount)}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-between rounded-[28px] bg-gradient-to-br from-slate-900 via-slate-950 to-slate-800 p-5 text-white">
                <div>
                  <p className="text-sm text-white/60">Tagihan Saat Ini</p>
                  <p className="mt-2 text-3xl font-bold tracking-tight">{formatRupiah(row.amount)}</p>
                  <p className="mt-2 text-sm leading-6 text-white/68">
                    Buka detail untuk melihat preview invoice dan simpan sebagai PDF dengan format yang rapi.
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href={`/transaksi/${row.id}`}
                    className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-white/90"
                  >
                    <Eye className="h-4 w-4" />
                    Detail Invoice
                  </Link>
                  {row.status === 'PENDING' && (
                    <Link
                      href={`/api/midtrans/snap?transactionId=${row.id}`}
                      className="inline-flex items-center gap-2 rounded-2xl border border-white/18 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                    >
                      <Wallet className="h-4 w-4" />
                      Bayar Sekarang
                    </Link>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-6 py-4 text-sm text-slate-500 lg:px-7">
              <p>Status pembayaran akan ter-update otomatis setelah transaksi Midtrans selesai.</p>
              <Link href={`/transaksi/${row.id}`} className="inline-flex items-center gap-1 font-medium text-slate-900 transition group-hover:gap-2">
                Lihat preview
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </article>
        ))}
      </section>

      <div className="mt-6">
        <PaginationLinks basePath="/transaksi" page={page} pageSize={pageSize} total={total} />
      </div>
    </main>
  );
}
