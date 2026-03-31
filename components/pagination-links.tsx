import Link from 'next/link';
import { buildPageHref } from '@/lib/pagination';

export function PaginationLinks({
  basePath,
  page,
  pageSize,
  total,
  extra
}: {
  basePath: string;
  page: number;
  pageSize: number;
  total: number;
  extra?: Record<string, string | undefined>;
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const prevPage = Math.max(1, page - 1);
  const nextPage = Math.min(totalPages, page + 1);

  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <p className="text-slate-500">Halaman {page} / {totalPages} · Total data: {total}</p>
      <div className="flex gap-2">
        <Link
          href={buildPageHref(basePath, prevPage, pageSize, extra)}
          className={`rounded-lg border px-3 py-1.5 ${page <= 1 ? 'pointer-events-none opacity-50' : ''}`}
        >
          Sebelumnya
        </Link>
        <Link
          href={buildPageHref(basePath, nextPage, pageSize, extra)}
          className={`rounded-lg border px-3 py-1.5 ${page >= totalPages ? 'pointer-events-none opacity-50' : ''}`}
        >
          Berikutnya
        </Link>
      </div>
    </div>
  );
}
