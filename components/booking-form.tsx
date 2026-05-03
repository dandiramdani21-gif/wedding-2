'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { formatRupiah } from '@/lib/utils';
import type { PackageSummary } from '@/lib/package-data';

export function BookingForm({
  packages,
  unavailableDates,
  initialPackageId
}: {
  packages: PackageSummary[];
  unavailableDates: string[];
  initialPackageId?: string;
}) {
  const [packageId, setPackageId] = useState(initialPackageId || packages[0]?.id || '');
  const [date, setDate] = useState('');
  const blocked = useMemo(() => new Set(unavailableDates), [unavailableDates]);
  const packageMap = useMemo(() => new Map(packages.map((pkg) => [pkg.id, pkg])), [packages]);
  const selected = packageMap.get(packageId) || packages[0];
  const dpAmount = selected ? Math.round(selected.total * 0.3) : 0;

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    if (blocked.has(date)) {
      e.preventDefault();
      alert('Tanggal sudah dibooking dan DP sudah dibayar, silakan pilih tanggal lain.');
    }
  }

  return (
    <form action="/api/bookings" method="POST" onSubmit={onSubmit} className="grid gap-5 lg:grid-cols-[1.1fr_1fr]">
      <div className="card overflow-hidden">
        <div className="relative h-72 md:h-[420px]">
          <Image
            src={selected?.imageUrl || 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1400&auto=format&fit=crop'}
            alt={selected?.name || 'Paket dekorasi'}
            fill
            className="object-cover"
          />
        </div>
        <div className="space-y-3 p-5">
          <p className="text-xs uppercase tracking-wider text-rose-600">Wedding Package</p>
          <h2 className="text-2xl font-bold">{selected?.name || 'Pilih Paket'}</h2>
          <p className="text-sm text-slate-600">{selected?.description}</p>
          <div className="rounded-lg bg-rose-50 p-3">
            <p className="text-sm text-slate-600">Total Paket</p>
            <p className="text-2xl font-bold text-rose-600">{formatRupiah(selected?.total || 0)}</p>
            <p className="text-sm text-slate-500">Estimasi DP 30%: {formatRupiah(dpAmount)}</p>
          </div>
          <div>
            <p className="mb-2 text-sm font-semibold">Isi Paket</p>
            <ul className="space-y-1 text-sm text-slate-700">
              {(selected?.items || []).map((item) => (
                <li key={item.id} className="flex justify-between gap-2">
                  <span>{item.itemName} ({item.quantity}x)</span>
                  <span className="font-medium">{formatRupiah(item.totalPrice)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="card space-y-4 p-5">
        <h3 className="text-xl font-semibold">Atur Jadwal Resepsi</h3>
        <input type="hidden" name="packageId" value={selected?.id || ''} />
        <select value={packageId} onChange={(e) => setPackageId(e.target.value)} className="w-full rounded-lg border p-2" required>
          <option value="">Pilih paket</option>
          {packages.map((pkg) => (
            <option key={pkg.id} value={pkg.id}>{pkg.name} - {formatRupiah(pkg.total)}</option>
          ))}
        </select>
        <input
          type="date"
          name="weddingDate"
          required
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full rounded-lg border p-2"
        />
        {date && blocked.has(date) && <p className="text-sm text-red-600">Tanggal ini tidak tersedia.</p>}
        <p className="text-xs text-slate-500">Tanggal dengan booking DP terbayar akan otomatis ditolak.</p>
        <button className="w-full rounded-lg bg-rose-600 p-2 font-semibold text-white">Booking Sekarang (Bayar DP)</button>
      </div>
    </form>
  );
}
