import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, CalendarDays, CreditCard, FileText, Package2, Wallet } from 'lucide-react';
import { requireAuth } from '@/lib/rbac';
import { prisma } from '@/lib/prisma';
import { formatDateLong, formatDateTime, formatRupiah } from '@/lib/utils';
import { InvoiceActions } from '@/components/invoice-actions';

function statusClasses(status: string) {
  if (status === 'PAID') return 'bg-emerald-100 text-emerald-700 ring-emerald-200';
  if (status === 'PENDING') return 'bg-amber-100 text-amber-700 ring-amber-200';
  return 'bg-rose-100 text-rose-700 ring-rose-200';
}

export default async function TransactionDetailPage({ params }: { params: { id: string } }) {
  const session = await requireAuth();

  const transaction = await prisma.transaction.findFirst({
    where: {
      id: params.id,
      userId: (session.user as any).id
    },
    select: {
      id: true,
      orderId: true,
      amount: true,
      status: true,
      transactionType: true,
      createdAt: true,
      payment: {
        select: {
          paymentMethod: true,
          paidAt: true
        }
      },
      booking: {
        select: {
          weddingDate: true,
          totalAmount: true,
          dpAmount: true,
          package: {
            select: {
              name: true,
              description: true,
              items: {
                select: {
                  id: true,
                  itemName: true,
                  quantity: true,
                  totalPrice: true
                }
              }
            }
          }
        }
      },
      user: {
        select: {
          name: true,
          email: true,
          phone: true,
          address: true
        }
      }
    }
  });

  if (!transaction) notFound();

  const packageItems = transaction.booking.package.items;
  const remainingAmount = Math.max(transaction.booking.totalAmount - transaction.booking.dpAmount, 0);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link href="/transaksi" className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50">
          <ArrowLeft className="h-4 w-4" />
          Kembali ke transaksi
        </Link>

        <div className="flex flex-wrap gap-3">
          {transaction.status === 'PENDING' && (
            <Link
              href={`/api/midtrans/snap?transactionId=${transaction.id}`}
              className="inline-flex items-center gap-2 rounded-2xl bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-500"
            >
              <Wallet className="h-4 w-4" />
              Lanjut Bayar
            </Link>
          )}
          <InvoiceActions />
        </div>
      </div>

      <section className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_25px_80px_rgba(15,23,42,0.08)] print:rounded-none print:border-0 print:shadow-none">
        <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top_left,_rgba(244,63,94,0.16),_transparent_50%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.12),_transparent_42%)]" />

        <div className="relative border-b border-slate-200/80 px-6 py-8 md:px-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="max-w-2xl">
              <p className="mb-3 inline-flex rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-white">
                Invoice Preview
              </p>
              <h1 className="text-3xl font-bold tracking-tight text-slate-950">Invoice Transaksi Wedding</h1>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Ringkasan pembayaran dan detail paket untuk acara {transaction.booking.package.name}. Halaman ini sudah siap untuk
                disimpan sebagai PDF saat menekan tombol download.
              </p>
            </div>

            <div className="grid gap-3 rounded-[28px] border border-slate-200 bg-white/90 p-5 shadow-sm backdrop-blur">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">No. Invoice</p>
                <p className="mt-1 text-lg font-semibold text-slate-900">{transaction.orderId}</p>
              </div>
              <span className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ring-1 ${statusClasses(transaction.status)}`}>
                {transaction.status}
              </span>
              <p className="text-sm text-slate-500">Dibuat {formatDateTime(transaction.createdAt)}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 px-6 py-8 md:grid-cols-[1.1fr_0.9fr] md:px-10">
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
                <div className="mb-3 flex items-center gap-2 text-slate-900">
                  <FileText className="h-4 w-4" />
                  <h2 className="font-semibold">Informasi Pemesan</h2>
                </div>
                <div className="space-y-2 text-sm text-slate-600">
                  <p className="font-medium text-slate-900">{transaction.user.name}</p>
                  <p>{transaction.user.email}</p>
                  <p>{transaction.user.phone || '-'}</p>
                  <p>{transaction.user.address || '-'}</p>
                </div>
              </div>

              <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
                <div className="mb-3 flex items-center gap-2 text-slate-900">
                  <CalendarDays className="h-4 w-4" />
                  <h2 className="font-semibold">Acara & Pembayaran</h2>
                </div>
                <div className="space-y-2 text-sm text-slate-600">
                  <p>
                    Tanggal acara:
                    <span className="ml-2 font-medium text-slate-900">{formatDateLong(transaction.booking.weddingDate)}</span>
                  </p>
                  <p>
                    Jenis transaksi:
                    <span className="ml-2 font-medium text-slate-900">{transaction.transactionType}</span>
                  </p>
                  <p>
                    Metode bayar:
                    <span className="ml-2 font-medium text-slate-900">{transaction.payment?.paymentMethod || 'Belum tersedia'}</span>
                  </p>
                  <p>
                    Tanggal bayar:
                    <span className="ml-2 font-medium text-slate-900">{transaction.payment?.paidAt ? formatDateTime(transaction.payment.paidAt) : '-'}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white p-5">
              <div className="mb-4 flex items-center gap-2 text-slate-900">
                <Package2 className="h-4 w-4" />
                <h2 className="font-semibold">Preview Detail Paket</h2>
              </div>
              <div className="mb-4 rounded-3xl bg-slate-950 px-5 py-5 text-white">
                <p className="text-xs uppercase tracking-[0.22em] text-white/60">Paket Dipilih</p>
                <p className="mt-2 text-2xl font-semibold">{transaction.booking.package.name}</p>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-white/70">{transaction.booking.package.description || 'Paket dekorasi wedding dengan susunan item yang sudah dipilih untuk acara Anda.'}</p>
              </div>

              <div className="space-y-3">
                {packageItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
                    <div>
                      <p className="font-medium text-slate-900">{item.itemName}</p>
                      <p className="text-slate-500">{item.quantity}x item</p>
                    </div>
                    <p className="font-semibold text-slate-900">{formatRupiah(item.totalPrice)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2 text-slate-900">
                <CreditCard className="h-4 w-4" />
                <h2 className="font-semibold">Ringkasan Invoice</h2>
              </div>
              <div className="space-y-3 text-sm text-slate-600">
                <div className="flex items-center justify-between">
                  <span>Total paket</span>
                  <span className="font-medium text-slate-900">{formatRupiah(transaction.booking.totalAmount)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Nominal DP</span>
                  <span className="font-medium text-slate-900">{formatRupiah(transaction.booking.dpAmount)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Sisa pembayaran</span>
                  <span className="font-medium text-slate-900">{formatRupiah(remainingAmount)}</span>
                </div>
                <div className="my-2 border-t border-dashed border-slate-200" />
                <div className="flex items-center justify-between text-base">
                  <span className="font-semibold text-slate-900">Tagihan transaksi ini</span>
                  <span className="text-xl font-bold text-rose-600">{formatRupiah(transaction.amount)}</span>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] bg-gradient-to-br from-rose-600 via-rose-500 to-orange-400 p-[1px]">
              <div className="rounded-[27px] bg-white p-5">
                <p className="text-sm font-semibold text-slate-900">Catatan</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Simpan halaman ini sebagai PDF untuk arsip. Jika status masih pending, lakukan pembayaran terlebih dahulu agar invoice
                  final tercatat lunas.
                </p>
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
              <p className="font-semibold text-slate-900">Butuh bantuan?</p>
              <p className="mt-2 leading-6">
                Hubungi admin Seven Party Decor dan sertakan nomor invoice <span className="font-semibold text-slate-900">{transaction.orderId}</span> agar proses pengecekan lebih cepat.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
