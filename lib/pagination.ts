export const DEFAULT_PAGE_SIZE = 10;

export function getPagination(searchParams: { page?: string; pageSize?: string } | URLSearchParams, fallbackPageSize = DEFAULT_PAGE_SIZE) {
  const pageRaw = searchParams instanceof URLSearchParams ? searchParams.get('page') : searchParams.page;
  const pageSizeRaw = searchParams instanceof URLSearchParams ? searchParams.get('pageSize') : searchParams.pageSize;

  const page = Math.max(1, Number(pageRaw || 1) || 1);
  const pageSize = Math.min(50, Math.max(1, Number(pageSizeRaw || fallbackPageSize) || fallbackPageSize));
  const skip = (page - 1) * pageSize;

  return { page, pageSize, skip, take: pageSize };
}

export function buildPageHref(basePath: string, page: number, pageSize: number, extra?: Record<string, string | undefined>) {
  const params = new URLSearchParams();
  params.set('page', String(page));
  params.set('pageSize', String(pageSize));

  if (extra) {
    Object.entries(extra).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
  }

  return `${basePath}?${params.toString()}`;
}
