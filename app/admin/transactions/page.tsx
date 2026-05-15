'use client';

import { useState, useEffect } from 'react';
import { Download, Calendar, Filter, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatRupiah } from '@/lib/utils';

interface Transaction {
  id: string;
  orderId: string;
  transactionType: string;
  amount: number;
  status: string;
  user: { name: string };
  booking: { package: { name: string } };
  createdAt: string;
}

interface FilterParams {
  status: string;
  from: string;
  to: string;
}

const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const DAY_NAMES = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState<FilterParams>({ status: '', from: '', to: '' });
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarMode, setCalendarMode] = useState<'from' | 'to'>('from');
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [loading, setLoading] = useState(false);

  // Fetch transactions
  useEffect(() => {
    fetchTransactions();
  }, [page, filters]);

  async function fetchTransactions() {
    setLoading(true);
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
      ...(filters.status && { status: filters.status }),
      ...(filters.from && { from: filters.from }),
      ...(filters.to && { to: filters.to })
    });

    const res = await fetch(`/api/admin/transactions?${params}`);
    const data = await res.json();
    setTransactions(data.rows || []);
    setTotal(data.total || 0);
    setLoading(false);
  }

  function handleFilterChange(name: keyof FilterParams, value: string) {
    setFilters(prev => ({ ...prev, [name]: value }));
    setPage(1);
  }

  function clearFilters() {
    setFilters({ status: '', from: '', to: '' });
    setPage(1);
  }

  // Calendar helpers
  function getDaysInMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate();
  }

  function getFirstDayOfMonth(year: number, month: number) {
    return new Date(year, month, 1).getDay();
  }

  function selectDate(day: number) {
    const date = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), day);
    const dateStr = date.toISOString().split('T')[0];

    if (calendarMode === 'from') {
      handleFilterChange('from', dateStr);
    } else {
      handleFilterChange('to', dateStr);
    }
    setShowCalendar(false);
  }

  function prevMonth() {
    setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1));
  }

  function nextMonth() {
    setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1));
  }

  // Export to CSV
  function exportToCSV() {
    const headers = ['No Invoice', 'User', 'Paket', 'Jenis', 'Jumlah', 'Status', 'Tanggal'];
    const rows = transactions.map(t => [
      t.orderId,
      t.user.name,
      t.booking.package.name,
      t.transactionType,
      t.amount,
      t.status,
      new Date(t.createdAt).toLocaleDateString('id-ID')
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `laporan-transaksi-${filters.from || 'all'}-${filters.to || 'all'}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function statusBadge(status: string) {
    if (status === 'PENDING') return 'bg-amber-100 text-amber-700';
    if (status === 'PAID') return 'bg-emerald-100 text-emerald-700';
    if (status === 'FAILED') return 'bg-rose-100 text-rose-700';
    if (status === 'EXPIRED') return 'bg-slate-100 text-slate-700';
    return 'bg-slate-100 text-slate-700';
  }

  const totalPages = Math.ceil(total / pageSize);

  // Calendar component
  const CalendarPicker = () => {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    return (
      <div className="absolute right-0 top-full mt-2 z-50 w-80 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <button onClick={prevMonth} className="p-1 hover:bg-slate-100 rounded-lg">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="font-semibold">
            {MONTH_NAMES[month]} {year}
          </span>
          <button onClick={nextMonth} className="p-1 hover:bg-slate-100 rounded-lg">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs">
          {DAY_NAMES.map(d => (
            <div key={d} className="py-2 text-slate-400">{d}</div>
          ))}
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {days.map(day => {
            const dateStr = new Date(year, month, day).toISOString().split('T')[0];
            const isFrom = filters.from === dateStr;
            const isTo = filters.to === dateStr;

            return (
              <button
                key={day}
                onClick={() => selectDate(day)}
                className={`
                  h-8 w-8 rounded-lg text-sm transition
                  ${isFrom || isTo ? 'bg-rose-500 text-white' : 'hover:bg-slate-100'}
                `}
              >
                {day}
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex items-center justify-between border-t pt-4 text-xs">
          <button
            onClick={() => { handleFilterChange(calendarMode, ''); setShowCalendar(false); }}
            className="text-slate-500 hover:text-slate-700"
          >
            Hapus
          </button>
          <button
            onClick={() => setShowCalendar(false)}
            className="text-rose-500 hover:text-rose-600"
          >
            Tutup
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-950">Laporan Transaksi</h1>
          <p className="mt-1 text-sm text-slate-500">Kelola dan unduh laporan semua transaksi</p>
        </div>

        <button
          onClick={exportToCSV}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600"
        >
          <Download className="h-4 w-4" />
          Unduh Laporan CSV
        </button>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-wrap items-end gap-3">
          {/* Status Filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-500">Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm focus:border-rose-300 focus:bg-white"
            >
              <option value="">Semua</option>
              <option value="PENDING">Pending</option>
              <option value="PAID">Lunas</option>
              <option value="FAILED">Gagal</option>
              <option value="EXPIRED">Kadaluarsa</option>
            </select>
          </div>

          {/* From Date */}
          <div className="relative space-y-1.5">
            <label className="text-xs font-medium text-slate-500">Dari Tanggal</label>
            <div className="relative">
              <button
                onClick={() => { setCalendarMode('from'); setShowCalendar(!showCalendar || calendarMode !== 'from'); }}
                className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm hover:bg-slate-100"
              >
                <Calendar className="h-4 w-4 text-slate-400" />
                {filters.from || 'Pilih tanggal'}
              </button>
              {showCalendar && calendarMode === 'from' && <CalendarPicker />}
            </div>
          </div>

          {/* To Date */}
          <div className="relative space-y-1.5">
            <label className="text-xs font-medium text-slate-500">Sampai Tanggal</label>
            <div className="relative">
              <button
                onClick={() => { setCalendarMode('to'); setShowCalendar(!showCalendar || calendarMode !== 'to'); }}
                className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm hover:bg-slate-100"
              >
                <Calendar className="h-4 w-4 text-slate-400" />
                {filters.to || 'Pilih tanggal'}
              </button>
              {showCalendar && calendarMode === 'to' && <CalendarPicker />}
            </div>
          </div>

          {/* Clear Filters */}
          {(filters.status || filters.from || filters.to) && (
            <button
              onClick={clearFilters}
              className="flex h-10 items-center gap-1.5 rounded-xl px-3 text-sm text-slate-500 hover:bg-slate-100"
            >
              <X className="h-4 w-4" />
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Total Transaksi</p>
          <p className="mt-2 text-2xl font-bold text-slate-950">{total}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Pending</p>
          <p className="mt-2 text-2xl font-bold text-amber-600">
            {transactions.filter(t => t.status === 'PENDING').length}
          </p>
        </div>
        <div className="card p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Lunas</p>
          <p className="mt-2 text-2xl font-bold text-emerald-600">
            {transactions.filter(t => t.status === 'PAID').length}
          </p>
        </div>
        <div className="card p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Total Pendapatan</p>
          <p className="mt-2 text-2xl font-bold text-rose-600">
            {formatRupiah(transactions.filter(t => t.status === 'PAID').reduce((sum, t) => sum + t.amount, 0))}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr className="text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                <th className="p-4">Invoice</th>
                <th className="p-4">Pengguna</th>
                <th className="p-4">Paket</th>
                <th className="p-4">Jenis</th>
                <th className="p-4">Jumlah</th>
                <th className="p-4">Status</th>
                <th className="p-4">Tanggal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center">
                    <div className="flex items-center justify-center gap-2 text-slate-500">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-rose-500 border-t-transparent" />
                      Memuat data...
                    </div>
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    Tidak ada transaksi yang ditemukan
                  </td>
                </tr>
              ) : (
                transactions.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50">
                    <td className="p-4">
                      <span className="font-mono text-sm font-medium">{t.orderId}</span>
                    </td>
                    <td className="p-4 text-sm">{t.user.name}</td>
                    <td className="p-4 text-sm">{t.booking.package.name}</td>
                    <td className="p-4">
                      <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium">
                        {t.transactionType}
                      </span>
                    </td>
                    <td className="p-4 text-sm font-semibold">{formatRupiah(t.amount)}</td>
                    <td className="p-4">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusBadge(t.status)}`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-slate-500">
                      {new Date(t.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3">
            <p className="text-sm text-slate-500">
              Menampilkan {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, total)} dari {total}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-lg px-3 py-1.5 text-sm hover:bg-slate-100 disabled:opacity-50"
              >
                Prev
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`h-8 w-8 rounded-lg text-sm ${
                      page === pageNum
                        ? 'bg-rose-500 text-white'
                        : 'hover:bg-slate-100'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="rounded-lg px-3 py-1.5 text-sm hover:bg-slate-100 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}