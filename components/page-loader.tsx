export function PageLoader({ label = 'Memuat halaman...' }: { label?: string }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/20 backdrop-blur-md">
      <div className="flex min-w-[220px] flex-col items-center gap-4 rounded-[28px] border border-white/60 bg-white/80 px-8 py-7 text-center shadow-[0_30px_80px_rgba(15,23,42,0.18)]">
        <div className="loader-spinner" aria-hidden="true" />
        <div className="space-y-1">
          <p className="text-sm font-semibold text-slate-900">{label}</p>
          <p className="text-xs text-slate-500">Mohon tunggu sebentar</p>
        </div>
      </div>
    </div>
  );
}
