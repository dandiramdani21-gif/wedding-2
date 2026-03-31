'use client';

import { useMemo, useState } from 'react';

export function BookingForm({ packages, unavailableDates }: { packages: any[]; unavailableDates: string[] }) {
  const [date, setDate] = useState('');
  const blocked = useMemo(() => new Set(unavailableDates), [unavailableDates]);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    if (blocked.has(date)) {
      e.preventDefault();
      alert('Tanggal sudah dibooking dan DP sudah dibayar, silakan pilih tanggal lain.');
    }
  }

  return (
    <form action="/api/bookings" method="POST" onSubmit={onSubmit} className="card space-y-3 p-5">
      <select name="packageId" className="w-full rounded-lg border p-2" required>
        <option value="">Pilih paket</option>
        {packages.map((pkg) => (
          <option key={pkg.id} value={pkg.id}>{pkg.name} - Rp {pkg.total.toLocaleString('id-ID')}</option>
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
      <button className="w-full rounded-lg bg-rose-600 p-2 text-white">Buat Booking (DP)</button>
    </form>
  );
}
