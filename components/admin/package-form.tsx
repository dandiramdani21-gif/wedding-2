'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatRupiah } from '@/lib/utils';

type Item = {
  itemName: string;
  quantity: number;
  unitPrice: number;
};

type Pkg = {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  items: Array<{
    id: string;
    itemName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
};

export function PackageForm({
  initial = [],
}: {
  initial?: Pkg[];
}) {
  const router = useRouter();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState('');

  const [items, setItems] = useState<Item[]>([
    {
      itemName: '',
      quantity: 1,
      unitPrice: 0,
    },
  ]);

  const [editingId, setEditingId] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const draftTotal = useMemo(() => {
    return items.reduce((sum, item) => {
      return (
        sum +
        Number(item.quantity) *
          Number(item.unitPrice)
      );
    }, 0);
  }, [items]);

  function changeItem(
    index: number,
    key: keyof Item,
    value: string
  ) {
    const next = [...items];

    next[index] = {
      ...next[index],
      [key]:
        key === 'itemName'
          ? value
          : Number(value),
    };

    setItems(next);
  }

  function resetForm() {
    setName('');
    setDescription('');
    setImageUrl('');
    setImagePreview('');

    setItems([
      {
        itemName: '',
        quantity: 1,
        unitPrice: 0,
      },
    ]);

    setEditingId(null);
  }

  function loadEdit(pkg: Pkg) {
    setEditingId(pkg.id);

    setName(pkg.name);
    setDescription(pkg.description || '');

    setImageUrl(pkg.imageUrl || '');
    setImagePreview(pkg.imageUrl || '');

    setItems(
      pkg.items.map((x) => ({
        itemName: x.itemName,
        quantity: x.quantity,
        unitPrice: x.unitPrice,
      }))
    );
  }

  async function convertToBase64(file: File) {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();

      reader.readAsDataURL(file);

      reader.onload = () => {
        resolve(reader.result as string);
      };

      reader.onerror = reject;
    });
  }

  async function handleImageChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];

    if (!file) return;

    // validation
    if (!file.type.startsWith('image/')) {
      alert('File harus berupa gambar');
      return;
    }

    // max 2mb
    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran gambar maksimal 2MB');
      return;
    }

    const base64 = await convertToBase64(file);

    setImageUrl(base64);
    setImagePreview(base64);
  }

  async function submit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setSaving(true);

    try {
      await fetch('/api/admin/packages', {
        method: editingId
          ? 'PATCH'
          : 'POST',

        headers: {
          'Content-Type':
            'application/json',
        },

        body: JSON.stringify(
          editingId
            ? {
                id: editingId,
                name,
                description,
                imageUrl,
                items,
              }
            : {
                name,
                description,
                imageUrl,
                items,
              }
        ),
      });

      resetForm();

      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  async function removePackage(id: string) {
    if (!confirm('Hapus paket ini?'))
      return;

    setDeletingId(id);

    try {
      await fetch(
        `/api/admin/packages?id=${id}`,
        {
          method: 'DELETE',
        }
      );

      if (editingId === id) {
        resetForm();
      }

      router.refresh();
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <form
        onSubmit={submit}
        className="
          rounded-3xl
          border border-neutral-200
          bg-white
          p-6
          shadow-[0_10px_30px_rgba(0,0,0,0.04)]
        "
      >
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-neutral-900">
            {editingId
              ? 'Edit Paket'
              : 'Tambah Paket'}
          </h3>

          <p className="mt-1 text-sm text-neutral-500">
            Kelola detail paket wedding
          </p>
        </div>

        <div className="space-y-4">
          <input
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            placeholder="Nama paket"
            className="
              h-12 w-full rounded-2xl
              border border-neutral-200
              bg-neutral-50
              px-4 text-sm
              outline-none transition
              focus:border-neutral-400
              focus:bg-white
            "
            required
          />

          <textarea
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            placeholder="Deskripsi paket"
            rows={4}
            className="
              w-full rounded-2xl
              border border-neutral-200
              bg-neutral-50
              px-4 py-3 text-sm
              outline-none transition
              focus:border-neutral-400
              focus:bg-white
            "
          />

          {/* upload image */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-neutral-700">
              Upload Gambar
            </label>

            <label
              className="
                flex cursor-pointer flex-col
                items-center justify-center
                rounded-3xl
                border border-dashed border-neutral-300
                bg-neutral-50
                px-6 py-10
                text-center
                transition
                hover:bg-neutral-100
              "
            >
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />

              <div className="space-y-2">
                <p className="text-sm font-medium text-neutral-700">
                  Klik untuk upload gambar
                </p>

                <p className="text-xs text-neutral-500">
                  PNG, JPG, WEBP maksimal
                  2MB
                </p>
              </div>
            </label>

            {(imagePreview || imageUrl) && (
              <div className="overflow-hidden rounded-3xl border border-neutral-200">
                <img
                  src={
                    imagePreview || imageUrl
                  }
                  alt="Preview"
                  className="h-64 w-full object-cover"
                />
              </div>
            )}
          </div>

          {/* items */}
          <div className="space-y-3">
            {items.map((item, idx) => (
              <div
                key={idx}
                className="grid gap-3 md:grid-cols-3"
              >
                <input
                  value={item.itemName}
                  onChange={(e) =>
                    changeItem(
                      idx,
                      'itemName',
                      e.target.value
                    )
                  }
                  placeholder="Nama item"
                  className="
                    h-12 rounded-2xl
                    border border-neutral-200
                    bg-neutral-50
                    px-4 text-sm
                    outline-none transition
                    focus:border-neutral-400
                    focus:bg-white
                  "
                  required
                />

                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) =>
                    changeItem(
                      idx,
                      'quantity',
                      e.target.value
                    )
                  }
                  placeholder="Qty"
                  className="
                    h-12 rounded-2xl
                    border border-neutral-200
                    bg-neutral-50
                    px-4 text-sm
                    outline-none transition
                    focus:border-neutral-400
                    focus:bg-white
                  "
                  required
                />

                <input
                  type="number"
                  min="0"
                  value={item.unitPrice}
                  onChange={(e) =>
                    changeItem(
                      idx,
                      'unitPrice',
                      e.target.value
                    )
                  }
                  placeholder="Harga satuan"
                  className="
                    h-12 rounded-2xl
                    border border-neutral-200
                    bg-neutral-50
                    px-4 text-sm
                    outline-none transition
                    focus:border-neutral-400
                    focus:bg-white
                  "
                  required
                />
              </div>
            ))}
          </div>

          {/* actions */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() =>
                setItems([
                  ...items,
                  {
                    itemName: '',
                    quantity: 1,
                    unitPrice: 0,
                  },
                ])
              }
              className="
                rounded-2xl border
                border-neutral-200
                px-4 py-2 text-sm
                font-medium
                transition hover:bg-neutral-100
              "
            >
              + Tambah Item
            </button>

            <div
              className="
                rounded-2xl
                bg-neutral-100
                px-4 py-2
                text-sm font-semibold
                text-neutral-700
              "
            >
              Total Draft:{' '}
              {formatRupiah(draftTotal)}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              disabled={saving}
              className="
                rounded-2xl
                bg-neutral-900
                px-5 py-3
                text-sm font-medium
                text-white
                transition
                hover:bg-neutral-800
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {saving
                ? 'Menyimpan...'
                : editingId
                ? 'Update Paket'
                : 'Simpan Paket'}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="
                  rounded-2xl border
                  border-neutral-200
                  px-5 py-3
                  text-sm font-medium
                  transition
                  hover:bg-neutral-100
                "
              >
                Batal
              </button>
            )}
          </div>
        </div>
      </form>

      {/* package list */}
      <div className="grid gap-5 md:grid-cols-2">
        {initial.map((pkg) => {
          const items = pkg.items || [];

          const total = items.reduce(
            (acc, x) =>
              acc + x.totalPrice,
            0
          );

          return (
            <div
              key={pkg.id}
              className="
                overflow-hidden rounded-3xl
                border border-neutral-200
                bg-white
                shadow-[0_10px_30px_rgba(0,0,0,0.04)]
              "
            >
              {pkg.imageUrl && (
                <img
                  src={pkg.imageUrl}
                  alt={pkg.name}
                  className="h-56 w-full object-cover"
                />
              )}

              <div className="p-5">
                <h3 className="text-lg font-semibold text-neutral-900">
                  {pkg.name}
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-neutral-500">
                  {pkg.description}
                </p>

                <ul className="mt-4 space-y-2 text-sm text-neutral-600">
                  {items.map((x) => (
                    <li
                      key={x.id}
                      className="flex items-center justify-between rounded-xl bg-neutral-50 px-3 py-2"
                    >
                      <span>
                        {x.itemName} (
                        {x.quantity}x)
                      </span>

                      <span className="font-medium">
                        {formatRupiah(
                          x.totalPrice
                        )}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-5 flex items-center justify-between">
                  <p className="text-lg font-bold text-neutral-900">
                    {formatRupiah(total)}
                  </p>

                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        loadEdit(pkg)
                      }
                      className="
                        rounded-2xl border
                        border-neutral-200
                        px-4 py-2 text-sm
                        font-medium
                        transition
                        hover:bg-neutral-100
                      "
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        removePackage(pkg.id)
                      }
                      disabled={
                        deletingId === pkg.id
                      }
                      className="
                        rounded-2xl
                        bg-red-600
                        px-4 py-2 text-sm
                        font-medium
                        text-white
                        transition
                        hover:bg-red-700
                        disabled:opacity-60
                      "
                    >
                      {deletingId === pkg.id
                        ? 'Menghapus...'
                        : 'Hapus'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}