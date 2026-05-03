'use client';

import dynamic from 'next/dynamic';

type Point = {
  date: string;
  revenue: number;
  transactions: number;
};

const RevenueChart = dynamic(() => import('@/components/admin/charts').then((mod) => mod.RevenueChart), {
  loading: () => <ChartSkeleton title="Grafik Pendapatan" />,
  ssr: false
});

const TransactionChart = dynamic(() => import('@/components/admin/charts').then((mod) => mod.TransactionChart), {
  loading: () => <ChartSkeleton title="Grafik Jumlah Transaksi" />,
  ssr: false
});

function ChartSkeleton({ title }: { title: string }) {
  return (
    <div className="card p-4">
      <h3 className="mb-3 font-semibold">{title}</h3>
      <div className="h-72 animate-pulse rounded-2xl bg-slate-100" />
    </div>
  );
}

export function DashboardCharts({ data }: { data: Point[] }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <RevenueChart data={data} />
      <TransactionChart data={data} />
    </div>
  );
}
