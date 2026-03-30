import Image from 'next/image';
import { formatRupiah } from '@/lib/utils';

export function PackageCard({ pkg }: { pkg: any }) {
  const total = pkg.items.reduce((acc: number, item: any) => acc + item.totalPrice, 0);
  return (
    <div className="card overflow-hidden">
      <div className="relative h-52">
        <Image
          src={pkg.imageUrl || 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?q=80&w=1200&auto=format&fit=crop'}
          fill
          className="object-cover"
          alt={pkg.name}
        />
      </div>
      <div className="space-y-3 p-5">
        <h3 className="text-xl font-semibold">{pkg.name}</h3>
        <p className="text-slate-600 text-sm">{pkg.description}</p>
        <p className="text-rose-600 font-bold">{formatRupiah(total)}</p>
        <a href={`/booking?packageId=${pkg.id}`} className="inline-block rounded-xl bg-rose-600 px-4 py-2 text-white">Booking Sekarang</a>
      </div>
    </div>
  );
}
