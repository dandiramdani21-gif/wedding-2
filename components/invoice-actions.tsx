'use client';

import { Download } from 'lucide-react';

export function InvoiceActions() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
    >
      <Download className="h-4 w-4" />
      Download Invoice
    </button>
  );
}
