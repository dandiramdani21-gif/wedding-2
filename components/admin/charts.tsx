'use client';

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Bar, BarChart } from 'recharts';

type Point = { date: string; revenue: number; transactions: number };

export function RevenueChart({ data }: { data: Point[] }) {
  return (
    <div className="card p-4">
      <h3 className="mb-3 font-semibold">Grafik Pendapatan</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#e11d48" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#e11d48" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="revenue" stroke="#e11d48" fill="url(#rev)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function TransactionChart({ data }: { data: Point[] }) {
  return (
    <div className="card p-4">
      <h3 className="mb-3 font-semibold">Grafik Jumlah Transaksi</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="transactions" fill="#0f172a" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
