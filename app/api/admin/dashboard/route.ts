import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminApi } from '@/lib/api-auth';

export async function GET(req: Request) {
  const admin = await requireAdminApi();
  if (!admin) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const url = new URL(req.url);
  const from = url.searchParams.get('from');
  const to = url.searchParams.get('to');

  const where = from && to ? { createdAt: { gte: new Date(from), lte: new Date(`${to}T23:59:59`) } } : {};

  const rows = await prisma.transaction.findMany({
    where,
    select: {
      orderId: true,
      amount: true,
      status: true,
      createdAt: true,
      user: {
        select: {
          name: true
        }
      },
      booking: {
        select: {
          package: {
            select: {
              name: true
            }
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  if (url.searchParams.get('download') === 'excel') {
    const XLSX = await import('xlsx');
    const data = rows.map((r) => ({ orderId: r.orderId, user: r.user.name, package: r.booking.package.name, amount: r.amount, status: r.status, date: r.createdAt.toISOString() }));
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, 'Report');
    const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
    return new Response(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="laporan-transaksi.xlsx"'
      }
    });
  }

  return NextResponse.json({ rows });
}
