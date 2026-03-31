'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatRupiah } from '@/lib/utils';

type Item = { itemName: string; quantity: number; unitPrice: number };
type Pkg = {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  items: Array<{ id: string; itemName: string; quantity: number; unitPrice: number; totalPrice: number }>;
};

export function PackageForm({ initial = [] }: { initial?: Pkg[] }) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [items, setItems] = useState<Item[]>([{ itemName: '', quantity: 1, unitPrice: 0 }]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const draftTotal = useMemo(() => items.reduce((sum, item) => sum + Number(item.quantity) * Number(item.unitPrice), 0), [items]);

  function changeItem(index: number, key: keyof Item, value: string) {
    const next = [...items];
    next[index] = { ...next[index], [key]: key === 'itemName' ? value : Number(value) };
    setItems(next);
  }

  function resetForm() {
    setName('');
    setDescription('');
    setImageUrl('');
    setItems([{ itemName: '', quantity: 1, unitPrice: 0 }]);
    setEditingId(null);
  }

  function loadEdit(pkg: Pkg) {
    setEditingId(pkg.id);
    setName(pkg.name);
    setDescription(pkg.description || '');
    setImageUrl(pkg.imageUrl || '');
    setItems(pkg.items.map((x) => ({ itemName: x.itemName, quantity: x.quantity, unitPrice: x.unitPrice })));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await fetch('/api/admin/packages', {
        method: editingId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingId ? { id: editingId, name, description, imageUrl, items } : { name, description, imageUrl, items })
      });
      resetForm();
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  async function removePackage(id: string) {
    if (!confirm('Hapus paket ini?')) return;
    setDeletingId(id);
    try {
      await fetch(`/api/admin/packages?id=${id}`, { method: 'DELETE' });
      if (editingId === id) resetForm();
      router.refresh();
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-5">
      <form onSubmit={submit} className="card space-y-3 p-4">
        <h3 className="font-semibold">{editingId ? 'Edit Paket' : 'Tambah Paket Baru'}</h3>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama paket" className="w-full rounded-lg border p-2" required />
        <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="URL gambar" className="w-full rounded-lg border p-2" />
        <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Deskripsi" className="w-full rounded-lg border p-2" />
        <div className="space-y-2">
          {items.map((item, idx) => (
            <div key={idx} className="grid gap-2 md:grid-cols-3">
              <input value={item.itemName} onChange={(e) => changeItem(idx, 'itemName', e.target.value)} placeholder="Nama item" className="rounded-lg border p-2" required />
              <input type="number" min="1" value={item.quantity} onChange={(e) => changeItem(idx, 'quantity', e.target.value)} placeholder="Qty" className="rounded-lg border p-2" required />
              <input type="number" min="0" value={item.unitPrice} onChange={(e) => changeItem(idx, 'unitPrice', e.target.value)} placeholder="Harga satuan" className="rounded-lg border p-2" required />
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => setItems([...items, { itemName: '', quantity: 1, unitPrice: 0 }])} className="rounded-lg border px-3 py-2 text-sm">+ Tambah Item</button>
          <span className="rounded-lg bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700">Total Draft: {formatRupiah(draftTotal)}</span>
        </div>
        <div className="flex gap-2">
          <button disabled={saving} className="block rounded-lg bg-slate-900 px-3 py-2 text-white disabled:opacity-60">{saving ? 'Menyimpan...' : editingId ? 'Update Dekor' : 'Simpan Paket'}</button>
          {editingId && <button type="button" onClick={resetForm} className="rounded-lg border px-3 py-2">Batal</button>}
        </div>
      </form>

      <div className="grid gap-4 md:grid-cols-2">
        {initial.map((pkg) => {
          const items = pkg.items || [];
          const total = items.reduce((acc, x) => acc + x.totalPrice, 0);
          return (
            <div key={pkg.id} className="card p-4">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold">{pkg.name}</h3>
                <div className="flex gap-2">
                  <button onClick={() => loadEdit(pkg)} className="rounded-md border px-2 py-1 text-xs font-semibold">EDIT</button>
                  <button onClick={() => removePackage(pkg.id)} disabled={deletingId === pkg.id} className="rounded-md bg-red-600 px-2 py-1 text-xs font-semibold text-white disabled:opacity-60">{deletingId === pkg.id ? '...' : 'HAPUS'}</button>
                </div>
              </div>
              <p className="text-sm text-slate-500">{pkg.description}</p>
              <ul className="mt-2 list-disc pl-5 text-sm text-slate-600">
                {items.map((x) => <li key={x.id}>{x.itemName} ({x.quantity}x) - {formatRupiah(x.totalPrice)}</li>)}
              </ul>
              <p className="mt-2 font-semibold text-rose-600">Total: {formatRupiah(total)}</p>
              <div className="mt-3 flex gap-2">
                <button onClick={() => loadEdit(pkg)} className="rounded-lg border px-3 py-1.5 text-sm font-medium">Edit Paket</button>
                <button onClick={() => removePackage(pkg.id)} disabled={deletingId === pkg.id} className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-60">{deletingId === pkg.id ? 'Menghapus...' : 'Hapus Paket'}</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
