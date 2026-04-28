import Image from 'next/image';
import { formatRupiah } from '@/lib/utils';

export function PackageCard({
  pkg,
}: {
  pkg: any;
}) {
  const total = pkg.items.reduce(
    (acc: number, item: any) =>
      acc + item.totalPrice,
    0
  );

  return (
    <div
      className="
        group flex h-full flex-col overflow-hidden
        rounded-3xl border border-neutral-200
        bg-white
        shadow-[0_10px_30px_rgba(0,0,0,0.04)]
        transition-all duration-300
        hover:-translate-y-1
        hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)]
      "
    >
      {/* image */}
      <div className="relative h-64 w-full overflow-hidden bg-neutral-100">
        {pkg.imageUrl ? (
          <Image
            src={pkg.imageUrl}
            alt={pkg.name}
            fill
            className="
              object-cover transition duration-500
              group-hover:scale-105
            "
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-neutral-400">
            Tidak ada gambar
          </div>
        )}

        {/* overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
      </div>

      {/* content */}
      <div className="flex h-full flex-col p-5">
        <div className="space-y-4">
          {/* title */}
          <div>
            <h3 className="text-xl font-semibold tracking-tight text-neutral-900">
              {pkg.name}
            </h3>

            <p className="mt-2 line-clamp-2 min-h-[40px] text-sm leading-relaxed text-neutral-500">
              {pkg.description}
            </p>
          </div>

          {/* items */}
          <div>
            <p
              className="
                mb-3 text-xs font-semibold uppercase
                tracking-[0.2em] text-neutral-400
              "
            >
              Item Paket
            </p>

            <ul className="space-y-2">
              {pkg.items
                .slice(0, 4)
                .map((item: any) => (
                  <li
                    key={item.id}
                    className="
                      flex items-start justify-between gap-3
                      rounded-2xl
                      bg-neutral-50
                      px-3 py-2
                    "
                  >
                    <span className="text-sm text-neutral-700">
                      {item.itemName}{' '}
                      <span className="text-neutral-400">
                        ({item.quantity}x)
                      </span>
                    </span>

                    <span className="shrink-0 text-sm font-semibold text-neutral-800">
                      {formatRupiah(
                        item.totalPrice
                      )}
                    </span>
                  </li>
                ))}
            </ul>

            {pkg.items.length > 4 && (
              <p className="mt-3 text-xs text-neutral-400">
                +{pkg.items.length - 4} item
                lainnya
              </p>
            )}
          </div>
        </div>

        {/* footer */}
        <div className="mt-auto pt-6">
          <div
            className="
              mb-4 flex items-center justify-between
              rounded-2xl
              bg-neutral-100
              px-4 py-3
            "
          >
            <span className="text-sm text-neutral-500">
              Total Paket
            </span>

            <span className="text-lg font-bold tracking-tight text-neutral-900">
              {formatRupiah(total)}
            </span>
          </div>

          <a
            href={`/booking?packageId=${pkg.id}`}
            className="
              inline-flex h-12 w-full items-center
              justify-center rounded-2xl
              bg-neutral-900
              px-4 text-sm font-medium
              text-white
              transition
              hover:bg-neutral-800
            "
          >
            Booking Sekarang
          </a>
        </div>
      </div>
    </div>
  );
}